<template>
  <div class="text-center">
    <v-dialog v-model="sheet" width="500">
      <template v-slot:activator="{ on, attrs }">
        <slot name="btn" v-bind:on="on" v-bind:attrs="attrs">
          <!-- Fallback content -->
          <v-btn color="purple" dark v-bind="attrs" v-on="on">
            Open Wallet
          </v-btn>
        </slot>
      </template>

      <v-list>
        <v-subheader>Select your prefered wallet</v-subheader>
        <v-list-item
          v-for="tile in tiles"
          :key="tile.title"
          @click="sheet = false; $emit('providerSelected', tile.provider)"
        >
          <v-list-item-avatar>
            <v-avatar size="32px" tile>
                <!-- :src="tile.img" -->
              <img
                :src="tile.img"
                :alt="tile.title"
                
              />
            </v-avatar>
          </v-list-item-avatar>
          <v-list-item-title>{{ tile.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-dialog>
  </div>
</template>

<script>
import image1 from '../assets/torus-logo.png';
import image2 from '../assets/metamask-logo.png';
import image3 from '../assets/walletconnect.png';

export default {
  name: "WalletOption",
  data: () => ({
    sheet: false,
    tiles: [
      {
        img: image3,
        title: "Wallet Connect",
        provider: "wallet-connect",
      },
      {
        img: image2,
        title: "MetaMask Wallet",
        provider: "ethereum",
      },
      {
        img: image1,
        title: "Torus Wallet",
        provider: "torus",
      },
    ],
  }),
};
</script>