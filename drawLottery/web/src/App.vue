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
let clock = null;
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

const drawLottery = () => {
    clearTimeout(clock);
    resultList.value = [];
    showList.value = [];
    const allList = nameList.value.map(item => item.name);
    const totalDraw = Number(number.value);
    if (isNaN(totalDraw) || totalDraw <= 0) {
        console.log("请输入有效的抽选人数");
        return;
    }

    // 直接打乱所有人员名单
    let availableList = [...allList];
    for (let i = availableList.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [availableList[i], availableList[j]] = [availableList[j], availableList[i]];
    }

    // 从打乱后的名单中抽取所需人数
    const result = availableList.slice(0, totalDraw);
    resultList.value = result;
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
