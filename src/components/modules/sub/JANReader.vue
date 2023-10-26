<script setup>
import Quagga_lib from 'quagga';
import codeSearch from './codeSearch.vue'
</script>

<template>
	<div class="text-center">
		<v-btn color="success" class="ma-2" @click.stop="janReaderDialog = true">{{ janReaderButton }}</v-btn>
		<v-dialog max-width="1024px" class="text-center" v-model="janReaderDialog">
			<v-card>
				<v-toolbar color="primary">
					<v-toolbar-title class="pa-4 ma-2">バーコード読取ツール</v-toolbar-title>
				</v-toolbar>

				<div class="readArea ma-4">
					<!-- カメラエリア -->
					<div id="cameraArea">
						<div v-html="innerHTML"></div>
					</div>
					
					<!-- 取得結果エリア -->
					<div v-if="code.length >= 2">
						<p class="getMessage mt-4">取得成功！</p>
						<p class="resultCode">{{ code }}</p>
						<!-- code-Search -->
						<codeSearch
							:codeSearchButton="codeSearchButton" 
							:intentCode="intentCode"
							@sendItemData="sendItemData"
						></codeSearch>
					</div>
					
					<!-- 操作ボタン -->
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
					<v-btn variant="text" @click="janReaderDialog = !janReaderDialog">画面を閉じる</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
export default{
	data(){
		return{
			//dialog control
			janReaderDialog: false,

			//JanReader control
			quagga: null,
			code: '',
			detectCount: 0,
			innerHTML: "",

			//intent codeSearch
			codeSearchButton: "取得したコードで検索",
			intentCode: "",

		}
	},
	props:{
		//btnName
		janReaderButton: {
			type: String,
			default: "コード読取"
		}
	},
	methods:{
		//dialog control

		//dialog btn funcs
		diagReset(){
			console.log(this.code, this.code.length)
			this.stopScan();
			this.code = "";
			this.innerHTML = "";
		},

		//JanReader btn funcs
		startScan(){
			this.code = "";
			this.innerHTML = "";
			this.initQuagga();
		},
		resetScan(){
			this.stopScan();
			this.innerHTML = "";
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
					this.innerHTML = `<img src='${img_url}' alt='result' class="resultImg"></img>`
					this.intentCode = this.code

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
		stopScan(){
			this.Quagga.offProcessed(this.onProcessed);
			this.Quagga.offDetected(this.onDetected);
			this.Quagga.stop();
		},

		//codeSearch->JanReader->create(parent)
		sendItemData(data){
			console.log("CS->JR: "+data)
			this.janReaderDialog = !this.janReaderDialog
			this.diagReset()
			this.$emit('sendItemData', data)
		}
	},
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