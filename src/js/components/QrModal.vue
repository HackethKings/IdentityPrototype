<template>
    <div>
        <b-modal @hidden="$emit('hidden')" centered title="QR Code"
                 ref="myModalRef" cancel-title="Reject" @ok="$emit('ok')">
            Username:{{username}}
            Address:{{address}}
            <canvas ref="canvas"></canvas>
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
