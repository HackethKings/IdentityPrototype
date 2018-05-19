<template>
    <div>
        <b-modal @hidden="$emit('hidden')" centered title="QR Code"
                 ref="myModalRef"
                 :ok-title="`Poprawna autoryzacja`" cancel-title="Odrzuć" @ok="$emit('ok')">
            Publiczny klucz:{{address}}
        </b-modal>
    </div>
</template>
<script>
    export default {
        props: ['address'],
        methods: {},
        mounted() {

            this.$nextTick(() => {
                this.$refs.myModalRef.show()
            })
        }
    }
</script>
