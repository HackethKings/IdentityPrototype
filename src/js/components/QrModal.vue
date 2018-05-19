<template>
    <div>
        <b-modal @hidden="$emit('hidden')" centered title="QR Code"
                 ref="myModalRef" cancel-title="Reject" @ok="$emit('ok')">
            <div style="position: relative;width: 100%;padding-bottom: 100%;">
                <canvas ref="canvas" style="width: 100%!important;height: 100%!important;left: 0;right: 0;top: 0;bottom: 0;position: absolute;"></canvas>
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
            }
        },
        mounted() {
            this.$nextTick(() => {
                this.$refs.myModalRef.show()
                QRCode.toCanvas(this.$refs.canvas, this.address, function (error) {
                    if (error)
                        console.error(error)
                });
            })
        }
    }
</script>
