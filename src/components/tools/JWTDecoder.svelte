<script lang="ts">
import { rootState } from '../../state/store';

    import Tool from '../Tool.svelte';

    const state = $rootState.jwtDecoder;

    $: parseJwt($state.token);

    function parseJwt(jwt: string) {
        if (jwt.length === 0) {
            $state.header = '';
            $state.payload = '';
            return;
        }

        const chunks = jwt.split('.');
        if (chunks.length !== 3) {
            $state.header = 'Error: invalid number of segments.';
            $state.payload = '';
            return;
        }

        try {
            $state.header = JSON.stringify(JSON.parse(atob(chunks[0])), null, 4);
        } catch (e) {
            $state.header = `Failed to base64 decode header: ${e}`
        }

        try {
            $state.payload = JSON.stringify(JSON.parse(atob(chunks[1])), null, 4);
        } catch (e) {
            $state.payload = `Failed to base64 decode payload: ${e}`
        }
    }
</script>

<Tool title="JWT Decoder">
    <div class="block">
        <p class="subtitle">Jwt Token</p>
        <textarea class="textarea" bind:value={$state.token}></textarea>
    </div>

    <div class="block">
        <p class="subtitle">Header</p>
        <textarea class="textarea" bind:value={$state.header}></textarea>
    </div>

    <div class="block">
        <p class="subtitle">Payload</p>
        <textarea class="textarea" bind:value={$state.payload}></textarea>
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
