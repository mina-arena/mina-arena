<script lang="ts">
  type PageSelected = 'INTRO' | 'KEYGEN' | 'DRAFT' | 'UNIT_STATS' | 'GAMEPLAY';

  const pages: PageSelected[] = ['INTRO', 'KEYGEN', 'DRAFT', 'UNIT_STATS', 'GAMEPLAY'];

  let pageSelected: PageSelected = 'INTRO';
  let size: number;
</script>

<svelte:window bind:innerWidth={size}/>
<div class="bg-chainmail bg-cover bg-no-repeat bg-fixed text-stone-300 min-h-screen">
  <div class="p-8 lg:p-12 lg:max-w-[75vw] 2xl:max-w-[50vw] mx-auto text-center">
    <h1 class="font-almendra-bold text-4xl uppercase my-8">How to play Mina Arena</h1>
    <div class="flex flex-col md:flex-row mb-8 bg-stone-800/80 p-2 rounded-lg">
      {#each pages as page}
        <div
            on:click={() => {
						pageSelected = page;
					}}
            on:keydown={() => {
						pageSelected = page;
					}}
            class={pageSelected === page
						? 'flex-grow flex justify-center items-center rounded px-4 py-2 cursor-pointer text-stone-200'
						: 'flex-grow flex justify-center items-center rounded px-4 py-2 cursor-pointer text-stone-500 hover:bg-stone-600 hover:text-white'}
        >
          {#if page === 'INTRO'}
            Introduction
          {:else if page === 'KEYGEN'}
            Authentication
          {:else if page === 'DRAFT'}
            Drafting Units
          {:else if page === 'UNIT_STATS'}
            Unit Stats
          {:else if page === 'GAMEPLAY'}
            Gameplay
          {/if}
        </div>
      {/each}
    </div>

    <div class="col-span-10 instructions text-left">
      {#if pageSelected === 'INTRO'}
        <h2 class="font-almendra-bold text-3xl">Introduction</h2>
        <p>
          Mina Arena is a (truly) free-to-play, multiplayer blockchain game where you control your
          team in the arena in turn-based combat against an opponent.
        </p>
        <img alt="Screenshot of the game board" src="./images/how_to_play/intro_arena.png" class="mx-auto my-[50px]"/>
        <p>Mina Arena is inspired by tabletop games like Warhammer and Axis and Allies.</p>
        <p>
          The instructions on this page will guide you through getting started and playing your
          first game.
        </p>
      {:else if pageSelected === 'KEYGEN'}
        <h2 class="font-almendra-bold text-3xl">Authentication</h2>
        <p>
          Instead of using usernames and passwords to log in, Mina Arena uses public-private
          keypairs. For now, we have not integrated with any mobile wallets like Brave or Auro.
          Instead, we save the keypair in your local browser storage.
        </p>
        <p>
          Before you can play, you will need to configure your credentials via the User Management
          page, as shown below.
        </p>
        <img alt="User menu" src="./images/how_to_play/intro_user_menu.png" class="mx-auto mt-[50px]"/>
        <p class="text-center italic">The user management button.</p>

        <img alt="Keygen" src="./images/how_to_play/intro_keygen.png" class="mx-auto mt-[50px]"/>
        <p class="text-center italic">
          The user management modal where you can set your public key.
        </p>
        <p>
          Once you set your Mina public key, you are ready to move on to drafting units and
          starting your first game! Your browser will remember your login for you in the future,
          as long as you don't clear your cache or browse in incognito mode.
        </p>
        <p>
          Warning: If you start playing Mina Arena and later go back to the user management tool
          and generate a new Mina public key, you will not be able to access your previous games
          or pieces.
        </p>
      {:else if pageSelected === 'DRAFT'}
        <h2 class="font-almendra-bold text-3xl">Drafting Units</h2>
        <p>
          When you start your first game, you will be taken to the squad selection page, where you
          will select which units you will bring to the battle.
        </p>
        <img alt="Squad selection – Drafting" src="./images/how_to_play/squad_selection_drafting.png" class="mx-auto mt-[50px]"/>
        <p class="text-center italic">The squad selection page.</p>
        <p>
          Mina Arena features a number of different types of units you can use in a battle, but
          each unit you use in the game will be unique.
        </p>
        <p>
          "Drafting" a unit means creating a new copy of that unit, with a custom name, which is
          specific to you and different from any other copies of that unit you or anyone else has
          created already. For example, you can create multiple copies of the Swordsman unit, each
          with individual names and game histories.
        </p>
        <img alt="Spadge, a Swordsman" src="./images/how_to_play/drafting_spadge.png" class="mx-auto mt-[50px]"/>
        <p class="text-center italic">Drafting a new Swordsman named Spadge.</p>

        <img alt="My units" src="./images/how_to_play/my_units.png" class="mx-auto mt-[50px]"/>
        <p class="text-center italic">Viewing 'My Units' to see your drafted units.</p>
        <p>
          The squad selection page shows your proposed squad along with their points cost as you
          select them. When you're ready to finalize your squad selection, click the Select Squad
          button.
        </p>

        <img alt="Final squad" src="./images/how_to_play/drafting_submit.png" class="mx-auto mt-[50px]"/>
        <p class="text-center italic">Finalizing your squad.</p>
      {:else if pageSelected === 'UNIT_STATS'}
        <h2 class="font-almendra-bold text-3xl">Unit Stats</h2>
        <p>Understanding how to read a unit card's stats is key to playing Mina Arena.</p>
        <img alt="Spearman stats" src="./images/how_to_play/stats_spearman.png" class="mx-auto mt-[50px]"/>
        <p class="text-center italic">Sample unit card showing stats of a Spearman unit.</p>
        <img alt="Ballista stats" src="./images/how_to_play/stats_ballista.png" class="mx-auto mt-[50px]"/>
        <p class="text-center italic">
          Sample unit card showing stats of a Ballista unit, which has a ranged attack.
        </p>

        <h4 class="text-2xl mt-8"><i class="fa fa-solid fa-person-running-fast"/> Movement Speed</h4>
        <p class="ml-8">Indicates how far the unit can move per turn.</p>

        <h4 class="text-2xl mt-8"><i class="fa fa-solid fa-shield"/> Armor Save</h4>
        <p class="ml-8">The roll needed on a D6 to block incoming damage with this unit's armor.</p>

        <h4 class="text-2xl mt-8"><i class="fa fa-solid fa-heart"/> Health</h4>
        <p class="ml-8">
          How much health this unit has remaining. When this is reduced to 0, the unit is
          destroyed and removed from the game.
        </p>

        <h4 class="text-2xl mt-8"><i class="fa fa-solid fa-sword"/> Melee Attack Profile</h4>
        <p class="ml-8">This unit's stats when attacking another unit with a melee attack.</p>

        <h4 class="text-2xl mt-8"><i class="fa fa-solid fa-bow-arrow"/> Ranged Attack Profile</h4>
        <p class="ml-8">
          This unit's stats when attacking another unit with a ranged attack. Not all units
          are equipped with ranged weapons.
        </p>

        <h4 class="text-2xl mt-8"><i class="fa fa-solid fa-hashtag"/> Number of Attacks</h4>
        <p class="ml-8">The number of attacks this unit makes when it attacks another unit.</p>

        <h4 class="text-2xl mt-8"><i class="fa fa-solid fa-bullseye-arrow"/> Hit Roll</h4>
        <p class="ml-8">The roll needed on a D6 for this unit to score a hit when it attacks. A failed hit
          roll will miss and not continue.</p>

        <h4 class="text-2xl mt-8"><i class="fa fa-solid fa-hand-fist"/> Wound Roll</h4>
        <p class="ml-8">The roll needed on a D6 for a successful hit from this unit to wound its target. A
          failed wound roll will not continue.</p>

        <h4 class="text-2xl mt-8"><i class="fa fa-solid fa-shield-slash"/> Armor Piercing</h4>
        <p class="ml-8">How effective an attack is at piercing enemy armor. The enemy's armor save roll will
          be reduced by this amount, making their armor save less likely to block the attack.</p>

        <h4 class="text-2xl mt-8"><i class="fa fa-solid fa-heart-crack"/> Attack Damage</h4>
        <p class="ml-8">How much damage this attack will do to the target if it successfully hits, wounds,
          and the enemy armor save fails.</p>

        <img
            alt="Ballista attacks swordsman"
            src="./images/how_to_play/ballista_attacks_swordsman.png"
            class="mx-auto mt-[50px]"
        />
        <p class="text-center italic">
          Example of a Ballista making a ranged attack at a Swordsman.
        </p>
        <p>
          In the above example, a Ballista unit makes a ranged attack against an enemy Swordsman.
          Let's analyze what happened to better understand unit stats:
        </p>
        <ul class="list-disc ml-4 [&>*]:mt-8">
          <li>
            The Ballista makes 2 ranged attacks as shown on its <i
              class="fa fa-solid fa-hashtag"
          /> <b>Number of Attacks</b> stat for its ranged attack profile.
          </li>
          <li>
            For each attack the Ballista makes, it must first make a hit roll. Each hit roll
            will succeed on a roll of 3+, as indicated by the Ballista's <i
              class="fa fa-solid fa-bullseye-arrow"
          /> <b>Hit Roll</b> stat.
          </li>
          <li>
            For each successful hit roll, it must then make a wound roll. Each wound roll will
            succeed on a roll of 2+, as indicated by the Ballista's <i
              class="fa fa-solid fa-hand-fist"
          /> <b>Wound Roll</b> stat.
          </li>
          <li>
            For each successful wound roll, the target unit must make an armor save roll.
            Because the Swordsman has an <i class="fa fa-solid fa-shield"/> <b>Armor Save</b>
            stat of 4+, it would normally block incoming damage on a roll of 4+, but in this case,
            because the Ballista's ranged attack has an <i class="fa fa-solid fa-shield-slash"/>
            <b>Armor Piercing</b> value of 2, the Swordsman's armor save roll is worsened by 2, meaning
            he needs to roll a 6 in order to block the damage.
          </li>
          <li>
            For each failed armor save roll, the target unit would suffer 2 damage as indicated
            by the Ballista's <i class="fa fa-solid fa-heart-crack"/> <b>Damage</b> stat.
          </li>
        </ul>
      {:else if pageSelected === 'GAMEPLAY'}
        <h2 class="font-almendra-bold text-3xl">Gameplay</h2>
        <p>In Mina Arena, players alternate taking turns commanding their armies.</p>
        <p>
          Each player's turn consists of a series of phases: the Movement phase, the Shooting
          phase, and the Melee phase.
        </p>
        <p>
          In every phase, the acting player may activate as many units as they wish, as long as
          those units are eligible to act within the current phase.
        </p>
        <p>
          In the Movement phase, units can be moved around the board up to some max distance based
          on their <i class="fa fa-solid fa-person-running-fast"/> <b>Movement Speed</b>.
        </p>
        <p>
          In the Shooting phase, units which are equipped with <i class="fa fa-solid fa-bow-arrow"/>
          <b>Ranged Weapons</b> can be ordered to make ranged attacks against enemy units within
          a certain distance based on their weapon's max range.
        </p>
        <p>
          In the Melee phase, units can be ordered to make melee attacks against enemy units
          within melee range.
        </p>

        <p>Below are some screenshots from an example game, showing some of these concepts:</p>

        <img alt="Game phase" src="./images/how_to_play/sample_game_movement_1.png" class="mx-auto mt-[50px]"/>
        <p class="text-center italic">
          New game started, Player 2 (blue) is randomly selected to go first, starting with their Movement phase.
        </p>
        <img alt="Movement range" src="./images/how_to_play/sample_game_movement_2.png" class="mx-auto mt-[50px]"/>
        <p class="text-center italic">
          Selected units show their movement range in gold, and melee range in deep red.
        </p>

        <img alt="Ranged attack" src="./images/how_to_play/sample_game_movement_3.png" class="mx-auto mt-[50px]"/>
        <p class="text-center italic">
          Selected units with ranged weapons show their max ranged attack distance in pink.
        </p>
        <img alt="Player 2 movement" src="./images/how_to_play/sample_game_movement_4.png" class="mx-auto mt-[50px]"/>
        <p class="text-center italic">Player 2 issues some move orders to their units.</p>

        <img alt="Submit phase orders" src="./images/how_to_play/sample_game_shooting_1.png" class="mx-auto mt-[50px]"/>
        <p class="text-center italic">Player 2 submits their phase orders, and their units move around the board.</p>

        <img alt="Player 2 ranged attack" src="./images/how_to_play/sample_game_shooting_2.png" class="mx-auto mt-[50px]"/>
        <p class="text-center italic">Player 2 only has one unit with a ranged attack, the Ballista, which they order to shoot at the enemy Ballista.</p>

        <img alt="Enemy ballista destroyed" src="./images/how_to_play/sample_game_shooting_3.png" class="mx-auto mt-[50px]"/>
        <p class="text-center italic">Player 2's Ballista destroys the enemy Ballista, details shown on the right.</p>

        <img alt="Player 1 turn" src="./images/how_to_play/sample_game_shooting_4.png" class="mx-auto mt-[50px]"/>
        <p class="text-center italic">Player 1 (red) takes their turn, moving forward and returning fire with their Archers.</p>

        <img alt="Melee attack" src="./images/how_to_play/sample_game_melee_1.png" class="mx-auto mt-[50px]"/>
        <p class="text-center italic">Finally closing the gap, Player 1 issues some melee attack orders.</p>

        <img alt="Enemy swordsman damaged" src="./images/how_to_play/sample_game_melee_2.png" class="mx-auto mt-[50px]"/>
        <p class="text-center italic">Some damage is done to the enemy Swordsman via a melee attack.</p>
      {/if}
    </div>
  </div>
</div>
