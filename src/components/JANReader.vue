<script setup>

</script>

<template>
	<v-dialog max-width="1024px" class="text-center">
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
						<v-img v-if="code.length" src="" alt="result" class="resultImg"></v-img>
					</div>
					<p v-if="code.length" class="getMessage">取得できました</p>
					<p class="resultCode">{{ code }}</p>
					<v-row justify="center" class="mx-2">
						<v-col>
							<v-btn block color="primary" @click="startScan">Scan</v-btn>
						</v-col>
						<v-col>
							<v-btn block color="error" aria-label="close" @click.prevent.stop="stopScan">Stop</v-btn>
						</v-col>
					</v-row>
				</div>


				<v-card-actions class="justify-end">
					<v-btn variant="text" @click="isActive.value = false">画面を閉じる</v-btn>
				</v-card-actions>
			</v-card>
		</template>
	</v-dialog>
</template>

<script>
import { Quagga } from 'quagga';

export default {
	data(){
		return {
			dialog: false,
			quagga: null,
			code: "",
		};
	},
	methods: {
		//btn funcs
		startScan() {
			this.code = "";
			this.initQuagga();
		},
		stopScan(){
			this.Quagga.offProcessed(this.onProcessed);
			this.Quagga.offDetected(this.onDetected);
			this.Quagga.stop();
		},

		//Quagga funcs
		initQuagga(){
			this.Quagga = Quagga;
			// this.Quagga.onProcessed(this.onProcessed);
			// this.Quagga.onDetected(this.onDetected);

			//Quagga config
			const config = {
				inputStream: {
					name: "Live",
					tyep: "LiveStream",
					target: document.querySelector("#cameraArea"),
					constraints: {facingMode: "enviroment" }
				},
				numOfWorkers: navigator.hardwareConcurrency || 4,
				decoder: { readers: ["ean_reader", "ean_8_reader"]}
			};
			this.Quagga.init(config, this.onInit);
		},
		onInit(err){
			if(err){
				console.error("Quaaga Error:" + err)
				return
			}
			console.info("Quagga init, Ready to Start");
			this.Quagga.start();
		},
		OnDetected(success){
			this.code = success.codeResult.code;
			const $resutImg = document.querySelector(".resutImg");
			$resutImg.setAttribute("src", this.Quagga.canvas.dom.image.toDataURL());
			this.Quagga.stop();
		},
		onProcessed(result){
			const drawingCtx = this.Quagga.canvas.ctx.overlay;
			const drawingCanvas = this.Quagga.canvas.dom.overlay;

			if(result) {
				if(result.boxes){
					drawingCtx.clearRect(0,0,drawingCanvas.width, drawingCanvas.height);
					const hasNotRead = (box) => box !== result.box;
					result.boxes.filter(hasNotRead).foreach(box => {
						this.Quagga.ImageDebug,drawPath(box, {x: 0, y: 1}, drawingCtx, {
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
		}
	}
};
</script>