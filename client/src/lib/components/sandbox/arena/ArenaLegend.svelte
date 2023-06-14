<script lang="ts">
  import { truncateMinaPublicKey } from '$lib/utils';

  export let playerPublicKeys: Array<string>;
  export let playerColors: Array<string>;

</script>

<div class="mr-6">
  <div>Legend:</div>
  <br />
  <div>
    <div>
      <div class="w-3 h-3 bg-[{playerColors[0]}] border border-zinc-600" />
      Player 1: {truncateMinaPublicKey(playerPublicKeys[0])}
    </div>
  </div>
  <br />
  <div>
    <div class="w-3 h-3 bg-[{playerColors[1]}] border border-zinc-600" />
    Player 2: {truncateMinaPublicKey(playerPublicKeys[1])}
  </div>
</div>