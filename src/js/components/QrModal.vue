<template>
    <div>
        <b-modal @hidden="$emit('hidden')" centered title="QR Code"
                 ok-only
                 ok-title="Cancel"
                 ref="myModalRef" cancel-title="Cancel" @ok="$emit('ok')">
            <h2 class="qr-title">Scan QR Code on your other device to connect accounts:</h2>
            <div style="position: relative;width: 100%;padding-bottom: 100%;">
                <canvas id="qrcode" ref="canvas"></canvas>
            </div>
        </b-modal>
    </div>
</template>
<script>
    import QRCode from 'qrcode'

    export default {
        props: ['address', 'username'],
        methods: {
            show() {
                this.$refs.myModalRef.show();
            },
            hide() {
                this.$refs.myModalRef.hide();
            }
        },
        mounted() {
            this.$nextTick(() => {
                this.$refs.myModalRef.show()
                QRCode.toCanvas(this.$refs.canvas, this.address, {width: 500, height: 500}, function (error) {
                    if (error)
                        console.error(error)
                });
            })
        }
    }
</script>
