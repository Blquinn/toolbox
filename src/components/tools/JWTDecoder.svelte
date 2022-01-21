<script lang="ts">
    import Tool from '../Tool.svelte';

    let jwtToken = '';
    let header = '';
    let payload = '';

    $: parseJwt(jwtToken);

    function parseJwt(jwt: string) {
        if (jwt.length === 0) {
            header = '';
            payload = '';
            return;
        }

        const chunks = jwt.split('.');
        if (chunks.length !== 3) {
            header = 'Error: invalid number of segments.';
            payload = '';
            return;
        }

        try {
            header = JSON.stringify(JSON.parse(atob(chunks[0])), null, 4);
        } catch (e) {
            header = `Failed to base64 decode header: ${e}`
        }

        try {
            payload = JSON.stringify(JSON.parse(atob(chunks[1])), null, 4);
        } catch (e) {
            payload = `Failed to base64 decode payload: ${e}`
        }
    }
</script>

<Tool title="JWT Decoder">
    <div class="block">
        <p class="subtitle">Jwt Token</p>
        <textarea class="textarea" bind:value={jwtToken}></textarea>
    </div>

    <div class="block">
        <p class="subtitle">Header</p>
        <textarea class="textarea" bind:value={header}></textarea>
    </div>

    <div class="block">
        <p class="subtitle">Payload</p>
        <textarea class="textarea" bind:value={payload}></textarea>
    </div>
</Tool>

<style lang="scss">
    .block {
        flex: 1;
        display: flex;
        flex-direction: column;

        textarea {
            flex: 1;
            font-family: monospace;
        }
    }
</style>
