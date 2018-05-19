<template>
    <div>
        <b-modal @hidden="$emit('hidden')" centered title="Scan QR Code"
                 ref="myModalRef"
                 :ok-title="`Authorize`" cancel-title="Cancel" @ok="$emit('ok')">

            <div style="position: relative;height: 0;padding-bottom: 60%;">
                <video ref="preview" style="width: 100%;height: 100%;position: absolute;left: 0;right: 0;top: 0;bottom: 0;margin: 0;"></video>
            </div>
        </b-modal>
    </div>
</template>
<script>
    import {QrcodeReader} from 'vue-qrcode-reader'
    import QRCode from 'qrcode'
    // import Instascan from 'instascan/src/scanner';
    // import './instascan.min';

    export default {
        props: [],
        components: {QrcodeReader},
        methods: {
            show() {
                this.$refs.myModalRef.show();
            },
            onDecode(content) {
                alert(content);
                console.log(content);
            },
        },
        mounted() {
            this.$nextTick(() => {
                this.$refs.myModalRef.show();
                this.$nextTick(() => {
                    let scanner = new Instascan.Scanner({video: this.$refs.preview});
                    scanner.addListener('scan', function (content) {
                        alert(content);
                        console.log(content);
                    });
                    Instascan.Camera.getCameras().then(function (cameras) {
                        if (cameras.length > 0) {
                            scanner.start(cameras[0]);
                        } else {
                            console.error('No cameras found.');
                        }
                    }).catch(function (e) {
                        console.error(e);
                    });
                })
            })
        }
    }
</script>
