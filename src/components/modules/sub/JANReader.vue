<script setup>
import codeSearch from './codeSearch.vue';
</script>

<template>
	<v-dialog max-width="1024px" class="text-center" v-model="dialog">
		<template v-slot:activator="{ props }">
			<v-btn color="success" v-bind="props" class="ma-2">バーコード読取</v-btn>
		</template>
		<template v-slot:default="{ isActive }">
			<v-card>
				<v-toolbar color="primary">
					<v-toolbar-title class="pa-4 ma-2">バーコード読取ツール</v-toolbar-title>
				</v-toolbar>
				<!-- 読取エリア -->
				<div class="readArea ma-4">
					<div id="cameraArea">
						<!-- <v-img v-show="code.length" src="" alt="result" id="resultImg"></v-img> -->
						<div v-html="innnerHTML"></div>
					</div>
					<div v-if="code.length >= 2">
						<p class="getMessage mt-4">取得成功!</p>
						<p class="resultCode">{{ code }}</p>
						<codeSearch btnTxt="取得したコードで検索" :read_code="code" @select-data="sendData"></codeSearch>
						<!-- <v-btn color="secondary" class="ma-2">取得したコードで検索</v-btn> -->
					</div>
					<v-row justify="center" class="ma-2">
						<v-col>
							<v-btn block color="primary" @click="startScan">Scan</v-btn>
						</v-col>
						<v-col>
							<v-btn block color="error" aria-label="close" @click.prevent.stop="resetScan">Reset</v-btn>
						</v-col>
					</v-row>
				</div>


				<v-card-actions class="justify-end">
					<v-btn variant="text" @click="isActive.value = false; diagReset();">画面を閉じる</v-btn>
				</v-card-actions>
			</v-card>
		</template>
	</v-dialog>
</template>

<script>
import Quagga_lib from 'quagga';

export default {
	data(){
		return {
			dialog: false,
			quagga: null,
			code: "",
			detectCount: 0,
			innnerHTML: "",
		};
	},
	methods: {
		//btn funcs
		diagReset(){
			console.log(this.code, this.code.length)
			this.stopScan();
			this.code = "";
			this.innnerHTML = "";
		},
		startScan() {
			this.code = "";
			this.innnerHTML = "";
			this.initQuagga();
		},
		stopScan(){
			this.Quagga.offProcessed(this.onProcessed);
			this.Quagga.offDetected(this.onDetected);
			this.Quagga.stop();
		},
		resetScan(){
			this.stopScan();
			this.innnerHTML = "";
			this.startScan();
		},

		//Quagga funcs
		initQuagga(){
			this.Quagga = Quagga_lib;

			//Quagga config
			const config = {
				inputStream: {
					name: "Live",
					tyep: "LiveStream",
					target: document.querySelector("#cameraArea"),
					constraints: {facingMode: "environment" }
				},
				numOfWorkers: navigator.hardwareConcurrency || 4,
				decoder: { readers: ["ean_reader", "ean_8_reader"]}
			};
			this.Quagga.init(config, this.onInit);
			this.Quagga.onProcessed(this.onProcessed);

			//何故か呼び出すとundifinedが投げられてしまう
			//this.Quagga.onDetected(this.onDetected);

			this.Quagga.onDetected((success) => {

				if(this.code === success.codeResult.code){
					this.detectCount++;
					console.log("detectCount="+this.detectCount+"\ncode="+this.code+"\nResult="+success.codeResult.code);
				} else {
					this.detectCount = 0;
					this.code = success.codeResult.code;
				}
				
				if(this.detectCount >= 3){
					const img_url = this.Quagga.canvas.dom.image.toDataURL();
					console.log(img_url);
					this.innnerHTML = `<img src='${img_url}' alt='result' class="resultImg"></img>`

					this.Quagga.stop();
					this.detectCount=0;
				}
				//const resutImg = document.querySelector("#resultImg");
				//resutImg.setAttribute("src", this.Quagga.canvas.dom.image.toDataURL());
			});
		},
		onInit(err){
			if(err){
				console.error("Quaaga Error:" + err)
				return
			}
			console.info("Quagga init, Ready to Start");
			this.Quagga.start();
		},
		// Quagga.OnDetected(success){
		// 	this.code = success.codeResult.code;
		// 	const $resutImg = document.querySelector(".resutImg");
		// 	$resutImg.setAttribute("src", this.Quagga.canvas.dom.image.toDataURL());
		// 	this.Quagga.stop();
		// },
		onProcessed(result){
			const drawingCtx = this.Quagga.canvas.ctx.overlay;
			const drawingCanvas = this.Quagga.canvas.dom.overlay;

			if(result) {
				if(result.boxes){
					drawingCtx.clearRect(0,0,drawingCanvas.width, drawingCanvas.height);
					const hasNotRead = (box) => box !== result.box;
					result.boxes.filter(hasNotRead).forEach(box => {
						this.Quagga.ImageDebug.drawPath(box, {x: 0, y: 1}, drawingCtx, {
							color: "green",
							lineWidth: 2,
						});
					});
				}

				if(result.box){
					this.Quagga.ImageDebug.drawPath(
						result.box,
						{ x: 0, y: 1},
						drawingCtx,
						{
							color: "blue",
							lineWidth: 2,
						}
					);
				}

				if(result.codeResult && result.codeResult.code){
					this.Quagga.ImageDebug.drawPath(
						result.line,
						{x: "x", y: "y"},
						drawingCtx,
						{
							color: "red",
							lineWidth: 3
						}
					);
				}
			}
		},
		sendData(data){
			alert(data.id)
			this.dialog = !this.dialog
			//this.isActive.value = false
			this.diagReset();
			this.$emit('select-data', data)
		}
	}
};
</script>

<style>
#cameraArea {
  overflow: hidden;
  width: 75%;
  height: 75%;
  margin: auto;
  position: relative;
  display: flex;
  align-items: center;
  align-items: flex-start;
}
#cameraArea video{
	width: 100%;
	height: 100%;
}
#cameraArea canvas {
  position: absolute;
  width: 100%;
  height: 100%;
}
.resultImg {
  position:absolute;
  width: 100%;
  height: 100%;
}
.resultCode {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
}
.getMessage {
  color: red;
}
</style>