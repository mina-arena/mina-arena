<script lang="ts">

  export let submitPhaseCallback: () => void;
  export let isLoading: Boolean;
  export let game: Game;

</script>

{#if isLoading}
  <button
    id="submit-phase-button"
    class="font-almendra-bold uppercase text-center py-4 px-5 m-2 rounded-lg home-button"
    disabled
  >
    <i class="fa-solid fa-arrows-rotate fa-spin"></i> Resolving...
  </button>
{:else if game.status === 'IN_PROGRESS'}
  <button
    id="submit-phase-button"
    class="font-almendra-bold uppercase text-center py-4 px-5 m-2 rounded-lg home-button"
    on:click={submitPhaseCallback}
  >
    Submit Phase
  </button>
{/if}