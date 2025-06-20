<template>
    <div id="app">
        <!-- 上传文件区域 -->
        <el-card class="box-card">
            <template #header>
                <div class="card-header">
                    <span>上传名单</span>
                </div>
            </template>
            <el-upload class="upload-demo" drag :before-upload="upload">
                <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                <div class="el-upload__text">拖动或者<em>点击上传文件</em></div>
            </el-upload>
        </el-card>

        <!-- 名单显示区 -->
        <el-card class="box-card" style="margin-top: 20px">
            <template #header>
                <div class="card-header">
                    <span>抽签名单</span>
                </div>
            </template>
            <el-tag
                :type="redIndex === index ? 'danger' : 'primary'"
                v-for="(item, index) in nameList"
                :key="item.name"
                size="large">
                {{ item.name }}
            </el-tag>
            <div
                v-if="nameList.length > 0"
                style="display: flex; justify-content: center; align-items: center; margin-top: 15px">
                <el-input v-model="number" placeholder="请输入抽人数" style="width: 120px; margin-right: 15px" />
                <el-button :loading="showList.length < resultList.length" type="primary" @click="drawLottery">
                    开始抽签
                </el-button>
            </div>
        </el-card>

        <!-- 抽签结果区 -->
        <el-card class="box-card" style="margin-top: 20px">
            <template #header>
                <div class="card-header">
                    <span>抽签结果</span>
                </div>
            </template>

            <el-tag type="success" v-for="(item, index) in showList" :key="item.name" size="large">
                {{ item }}
            </el-tag>
        </el-card>
    </div>
</template>

<script setup>
import { ref } from "vue";
import * as XLSX from "xlsx";
const nameList = ref([]);
const number = ref(0);
const resultList = ref([]);
const redIndex = ref(-1);
const showList = ref([]);
function readData(file) {
    return new Promise(resolve => {
        const fileReader = new FileReader();
        fileReader.onload = e => {
            const result = e.target?.result;
            const workbook = XLSX.read(result, { type: "binary" });
            const res = workbook.SheetNames.map(sheet => XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
            resolve(res);
        };
        fileReader.readAsBinaryString(file);
    });
}

const upload = async e => {
    nameList.value = (await readData(e))[0];
    return false;
};
let must = window.res?.must || [];
let no = window.res?.no || [];
let clock = null;
console.log(must, no);
const drawLottery = () => {
    clearTimeout(clock);
    resultList.value = [];
    showList.value = [];
    const allList = nameList.value.map(item => item.name);
    // 过滤掉 no 数组中的人员
    let availableList = allList.filter(item => !no.includes(item));
    const totalDraw = Number(number.value);
    if (isNaN(totalDraw) || totalDraw <= 0) {
        console.log("请输入有效的抽选人数");
        return;
    }

    // 确保 must 数组中的人员都在 allList 中
    must = must.filter(item => allList.includes(item));
    no = no.filter(item => allList.includes(item));

    let finalMust = must;
    // 当必须抽中的人数大于抽签人数，随机选一个
    if (must.length > totalDraw) {
        const randomIndex = Math.floor(Math.random() * must.length);
        finalMust = [must[randomIndex]];
    }

    const result = [];
    // 先加入最终确定的 must 数组中的人员
    result.push(...finalMust);

    // 计算剩余需要抽取的人数
    let remaining = totalDraw - finalMust.length;

    // 打乱 availableList 顺序并过滤掉 finalMust 中的人员
    availableList = availableList.filter(item => !finalMust.includes(item));
    for (let i = availableList.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [availableList[i], availableList[j]] = [availableList[j], availableList[i]];
    }

    // 从 availableList 中抽取剩余人数
    while (remaining > 0 && availableList.length > 0) {
        result.push(availableList.pop());
        remaining--;
    }

    // 如果 availableList 抽完了还有剩余名额，从 no 中抽取
    if (remaining > 0 && no.length > 0) {
        let noShuffled = [...no];
        for (let i = noShuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [noShuffled[i], noShuffled[j]] = [noShuffled[j], noShuffled[i]];
        }
        while (remaining > 0 && noShuffled.length > 0) {
            result.push(noShuffled.pop());
            remaining--;
        }
    }

    // 随机均匀分布 finalMust 中的人员
    const newResult = [];
    const segments = result.length;
    const mustQueue = [...finalMust];
    const otherNames = result.filter(name => !finalMust.includes(name));

    for (let i = 0; i < segments; i++) {
        if (mustQueue.length > 0 && Math.random() < mustQueue.length / (segments - i)) {
            newResult.push(mustQueue.shift());
        } else if (otherNames.length > 0) {
            newResult.push(otherNames.shift());
        }
    }

    resultList.value = newResult.slice(0, totalDraw);
    animation();
};
const animation = async () => {
    const sleep = time =>
        new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, time);
        });
    const targetList = [...resultList.value];
    const select = () =>
        new Promise(resolve => {
            clock = setTimeout(() => {
                redIndex.value += 1;
                if (redIndex.value >= nameList.value.length) redIndex.value = redIndex.value - nameList.value.length;
                resolve();
            }, 100);
        });
    while (targetList.length > 0) {
        const target = targetList[0];
        await select();
        if (nameList.value[redIndex.value]?.name === target) {
            const showItem = targetList.shift();
            showList.value.push(showItem);
            await sleep(1500);
        }
    }
    clearTimeout(clock);
    clock = null;
};
</script>

<style>
.el-card,
.el-upload-dragger,
.el-tag,
.el-input__wrapper,
.el-button {
    border-radius: 0px !important;
}
.box-card {
    width: 100%;
}
.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.el-tag {
    margin-right: 8px;
    margin-bottom: 8px;
}
</style>
