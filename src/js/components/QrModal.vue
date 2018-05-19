<template>
    <div>
        <b-modal @hidden="$emit('hidden')" centered title="QR Code"
                 ref="myModalRef"
                 :ok-title="`Poprawna autoryzacja`" cancel-title="Odrzuć" @ok="$emit('ok')">
            Publiczny klucz:{{address}}
            <canvas ref="canvas"></canvas>
        </b-modal>
    </div>
</template>
<script>
    import QRCode from 'qrcode'
    export default {
        props: ['address'],
        methods: {},
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
