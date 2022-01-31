<script lang="ts">
  import ConfigBox from "../ConfigBox.svelte";
  import Tool from "../Tool.svelte";
  import SelectDropdown from "../SelectDropdown.svelte";
  import { formats, type Ops, type TimeFormat } from "../../time-conversion";

  let activeInputFormat: TimeFormat = "unix-sec";

  let inputPlaceholder = "";
  let inputText = "";

  const formatList: [TimeFormat, Ops][] = [
    ["unix-sec", formats["unix-sec"]],
    ["unix-milli", formats["unix-milli"]],
    ["iso-8601", formats["iso-8601"]],
  ];

  const emptyTime = "-";
  let localTime = emptyTime;
  let utcTime = emptyTime;

  const formatOpts: [TimeFormat, string][] = formatList.map((f) => [
    f[0],
    f[1].name,
  ]);

  const emptyOutputs: [TimeFormat, { name: string; value: string }][] =
    formatList.map((f) => [f[0], { name: f[1].name, value: emptyTime }]);
  let outputs = emptyOutputs;

  $: convert(inputText, activeInputFormat);
  function convert(input: string, fmt: TimeFormat) {
    input = input.trim();

    if (!input) {
      outputs = emptyOutputs;
      localTime = emptyTime;
      utcTime = emptyTime;
      return;
    }

    const d: Date = formats[fmt].parse(input);
    outputs = formatList.map((l) => {
      let value = "";
      try {
        value = l[1].format(d);
      } catch (e) {
        value = `Error: ${e}`;
      }
      return [l[0], { name: l[1].name, value }];
    });

    localTime = d.toString();
    utcTime = d.toUTCString();
  }

  $: setInputPlaceholder(activeInputFormat);
  function setInputPlaceholder(fmt) {
    const format: Ops = formats[fmt];
    inputPlaceholder = `${format.name} - e.g. ${format.format(new Date())}`;
  }
</script>

<Tool title="Timestamp Converter">
  <p class="subtitle">Configuration</p>

  <ConfigBox title="Input Format">
    <SelectDropdown
      options={formatOpts}
      bind:activeOption={activeInputFormat}
    />
  </ConfigBox>

  <div class="block">
    <p class="subtitle">Input</p>
    <input
      type="text"
      class="input"
      placeholder={inputPlaceholder}
      bind:value={inputText}
    />
  </div>

  <div class="block">
    <p class="subtitle">Output</p>
    <div class="outputs">
      <div class="box">
        <p class="is-size-5 has-text-weight-bold">Local Time</p>
        <p class="selectable">{localTime}</p>
      </div>

      <div class="box">
        <p class="is-size-5 has-text-weight-bold">UTC Time</p>
        <p class="selectable">{utcTime}</p>
      </div>

      {#each outputs as output}
        <div class="box">
          <p class="is-size-5 has-text-weight-bold">{output[1].name}</p>
          <p class="selectable">{output[1].value}</p>
        </div>
      {/each}
    </div>
  </div>
</Tool>

<style lang="scss">
  .is-centered {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  .outputs {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    > * {
      width: 48%;
      margin-left: 1%;
      margin-right: 1%;
    }
  }
</style>
