<template>
    <div>
        <b-modal @hidden="$emit('hidden')" centered title="Scan QR Code"
                 ref="myModalRef"
                 ok-only
                 ok-title="Hide" @ok="$emit('ok')">

            <div style="position: relative;height: 0;padding-bottom: 60%;">
                <video ref="preview"
                       style="width: 100%;height: 100%;position: absolute;left: 0;right: 0;top: 0;bottom: 0;margin: 0;"></video>
            </div>
        </b-modal>
    </div>
</template>
<script>
    import {QrcodeReader} from 'vue-qrcode-reader'
    import QRCode from 'qrcode'

    import {mapActions, mapState, mapMutations} from 'vuex';
    import IdentityRepository from "../lib/repositories/IdentityRepository";
    import Relay from "../lib/Relay";
    // import Instascan from 'instascan/src/scanner';
    // import './instascan.min';

    export default {
        props: [],
        components: {QrcodeReader},
        computed: {
            ...mapState(['identity'])
        },
        methods: {
            show() {
                this.$refs.myModalRef.show();
            },
            async handleSuccessfulKeyScan(scannedPublicKey) {
                await (new Relay()).addNewPublicKey(this.identity.identityAddress, scannedPublicKey);
            }
        },
        mounted() {
            this.$nextTick(() => {
                this.$refs.myModalRef.show();
                this.$nextTick(() => {
                    let scanner = new Instascan.Scanner({video: this.$refs.preview});
                    scanner.addListener('scan', (content) => {
                        // alert(content);
                        console.log(content);
                        this.handleSuccessfulKeyScan(content);
                    });
                    Instascan.Camera.getCameras().then((cameras) => {
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
