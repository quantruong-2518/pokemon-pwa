import { Component, OnInit } from '@angular/core';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { PokemonService } from './services/pokemon.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'testPWA';

  pkmImages: any;
  pkmName: number;
  searchContent = 1;

  readonly VAPID_PUBLIC_KEY =
    'BHtqpsAqAe2xMBqX9RJv-Cakxq3R-y-BJNfMADk5_9mdBbTzMwwz9xqaAWw-lgE6bWxaewfgQCERCcVvX9ZU23c';

  constructor(
    private _pokemonServices: PokemonService,
    private _swPush: SwPush,
    private _swUpdate: SwUpdate
  ) {
    this.searchPokemon();
    this.reloadCache();
  }

  ngOnInit(): void {
    let deferredPrompt;

    const addBtn = document.getElementById('add-button');

    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      deferredPrompt = e;
      // Update UI to notify the user they can add to home screen
      addBtn.style.display = 'block';

      addBtn.addEventListener('click', (e) => {
        // hide our user interface that shows our A2HS button
        addBtn.style.display = 'none';
        // Show the prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the A2HS prompt');
          } else {
            console.log('User dismissed the A2HS prompt');
          }
          deferredPrompt = null;
        });
      });
    });
  }

  reloadCache() {
    if (this._swUpdate.isEnabled) {
      this._swUpdate.available.subscribe((event) => {
        if (confirm('New version available! Would you like update?')) {
          window.location.reload();
        }
      });
    }
  }

  searchPokemon() {
    this._pokemonServices.getPokemon(this.searchContent).subscribe((pkm) => {
      this.pkmName = pkm.name;
      this.pkmImages = Object.entries(pkm.sprites);
    });
  }

  inputChanges(id: number) {
    this.searchContent = id;
  }
}
