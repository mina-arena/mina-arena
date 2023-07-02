<script lang="ts">

  export let submitPhaseCallback: () => void;
  export let isLoading: Boolean;

</script>

{#if isLoading}
  <button
    id="submit-phase-button"
    class="mx-auto m-2 p-2 rounded-lg border border-slate-500 bg-gray-100 text-gray-700"
    disabled
  >
    <i class="fa-solid fa-arrows-rotate fa-spin"></i> Resolving...
  </button>
{:else}
  <button
    id="submit-phase-button"
    class="mx-auto m-2 p-2 rounded-lg border border-slate-800 bg-gray-200 hover:bg-gray-400"
    on:click={submitPhaseCallback}
  >
    Submit Phase
  </button>
{/if}