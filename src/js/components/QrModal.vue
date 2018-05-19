<template>
    <div>
        <b-modal @hidden="$emit('hidden')" centered title="QR Code"
                 ref="myModalRef"
                 :ok-title="`Authorize`" cancel-title="Reject" @ok="$emit('ok')">
            Username:{{username}}
            Address:{{address}}
        </b-modal>
    </div>
</template>
<script>
    export default {
        props: ['address', 'username'],
        methods: {},
        mounted() {

            this.$nextTick(() => {
                this.$refs.myModalRef.show()
            })
        }
    }
</script>
