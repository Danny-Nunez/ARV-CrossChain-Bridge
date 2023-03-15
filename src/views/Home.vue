<template>
  <v-card class="wrapper">
    <v-card-text>
      <v-sheet class="text-center pb-8">
        <v-form ref="form"  lazy-validation>
          <div class="header"><b>ARV Cross Chain Bridge</b></div>

          <!-- <v-card flat outlined class="rounded-lg mb-6 pa-4">
            Transaction can take up to 30 minutes depending on network. Artemis
            Vision Bridge underlying liquidity is currently powered by
            Multichain (Previously AnySwap). For support related queries, please
            join here and contact the admins.
          </v-card> -->
          <div class="addresstitle">
          
          </div>
          <v-card outlined>
            <div class="vcardwrap">
             <p v-if="walletData"> From: {{ walletData.accounts[0].slice(0, 5)}}...{{this.walletData.accounts[0].slice(-4)}}</p>
              <p v-else>From: </p>
              <v-spacer></v-spacer>
              <p v-if="wallet_balance">Balance: {{ wallet_balance }} {{poolNetwork.symbol }}</p>
              <p v-else> Balance: -</p>
            </div>
            <v-row class="vcardwrap">
              <v-col cols="12" sm="4">
                <v-text-field
                  :rules="priceRules"
                  solo
                  class="mx-0"
                  outlined
                  v-model="fromPrice"
                  type="number"
                  label="0.00"
                  
                >
                </v-text-field>
              </v-col>
              <!-- <v-col cols="12" sm="4">
                <v-select
                  :items="['ARV']"
                  class="mx-4"
                  label="ARV"
                  flat
                  solo
                  return-object
                  outlined
                >
                  <template v-slot:prepend-inner>
                    <img width="24" height="24" src="images/arv-icon.png" />
                  </template>
                </v-select>
              </v-col> -->
              <v-col cols="12" sm="8">
                <v-select
                  class="mx-0"
                  v-model="fromNetwork"
                  @change="(chain) => changeChainNetwork('from', chain)"
                  item-text="label"
                  item-value="id"
                  :items="networks"
                  label="Select network chain"
                  
                  solo
                  return-object
                  outlined
                >
                  <template v-slot:prepend-inner>
                    <img width="40" height="24" :src="fromNetwork.icon" />
                  </template>
                </v-select>
              </v-col>
            </v-row>
          </v-card>

          <v-card outlined class="rounded-lg mb-6">
            <div class="vcardwrap">
              <p v-if="walletData"> To: {{ walletData.accounts[0].slice(0, 5)}}...{{this.walletData.accounts[0].slice(-4)}}</p>
              <p v-else> To: </p>
              <v-spacer></v-spacer>
              <v-spacer></v-spacer>
              <p>Balance: -</p>
            </div>
            <v-row class="vcardwrap">
              <v-col cols="12" sm="4">
                <v-text-field
                  :rules="priceRules"
                  solo
                  class="mx-0"
                  outlined
                  v-model="fromPrice"
                  disabled
                 
                  type="number"
                  label="0.00"
                >
                </v-text-field>
              </v-col>
              <!-- <v-col cols="12" sm="4">
                <v-select
                  :items="['ARV']"
                  class="mx-4"
                  label="ARV"
                  flat
                  solo
                  return-object
                  outlined
                >
                  <template v-slot:prepend-inner>
                    <img width="24" height="24" src="images/arv-icon.png" />
                  </template>
                </v-select>
              </v-col> -->
              <v-col cols="12" sm="8">
                <v-select
                  class="mx-0"
                  v-model="toNetwork"
                  @change="(chain) => changeChainNetwork('to', chain)"
                  item-text="label"
                  item-value="id"
                  :items="toNetworks"
                  label="Select network chain"
                  
                  solo
                  return-object
                  outlined
                >
                  <template v-slot:prepend-inner>
                    <img width="40" height="24" :src="toNetwork.icon" />
                  </template>
                </v-select>
              </v-col>
            </v-row>
          </v-card>

          <v-btn
            @click="confirm"
            v-if="walletData"
            rounded
            small
            depressed
            color="#CE45F7"
            class="ml-2 py-6 px-16 rounded"
            dark
            >Swap</v-btn
          >

          <WalletOption v-else v-on:providerSelected="connect">
            <template v-slot:btn="{ on, attrs }">
              <v-btn
                rounded
                small
                depressed
                color="#CE45F7"
                class="ml-2 py-6 px-16 rounded"
                v-bind="attrs"
                v-on="on"
                dark
                >Connect</v-btn
              >
              <div>
                <ul class="disclaimer">
                  <span>💡 Reminder:</span>
                  <li>Crosschain Fee is 0.00 %, Gas fee 0.00 ARV for your cross-chain transaction on destination chain</li>
                  <li>Minimum Crosschain Amount is 45 ARV</li>
                  <li>Maximum Crosschain Amount is 5,600,000 ARV</li>
                  <li>Estimated Time of Crosschain Arrival is 10-30 min</li>
                  <li>Crosschain amount larger than 1,200,000 ARV could take up to 12 hours</li>
              </ul>
              </div>
            </template>
          </WalletOption>
        </v-form>

        <div class="text-center">
          
          <v-dialog v-model="showDialog" width="480">
            
            
            <v-card outlined class="rounded-lg mb-8 pb-4 px-3">
              <v-card-title class="lighten-2">
                
                Cross-chain Router<v-spacer></v-spacer><div ><button @click="showDialog = false" class="closebutton">X</button></div>
              </v-card-title>

              <v-card-text >
                <v-card outlined class="rounded-lg mb-2 py-4 px-4">
                  <div>From</div>
                  <div class="d-flex mt-2">
                    <img
                      class="mr-4"
                      width="40"
                      height="24"
                      :src="fromNetwork.icon"
                    />
                    <p>{{ fromNetwork.label }}</p>
                    <v-spacer></v-spacer>
                    <p>- {{ fromPrice }}</p>
                  </div>
                  <a
                    v-if="fromTransactionHash"
                    :href="
                      fromNetwork.blockExplorerUrls +
                      '/tx/' +
                      fromTransactionHash
                    "
                    class="link"
                    target="_blank"
                  >
                    View Transaction {{ fromNetwork.blockExplorerUrls }}
                  </a>
                </v-card>
                <v-card
                 
                  outlined
                  color="grey"
                  v-if="fromLoading"
                  class="rounded-lg mb-8 pt-3 px-4"
                >
                  <div theme="dark" class="d-flex">
                    <p>{{ fromNetwork.label }} Status</p>

                    <v-spacer></v-spacer>
                    <v-progress-circular
                      indeterminate
                      color="primary"
                    ></v-progress-circular>
                  </div>
                </v-card>

                <v-card outlined class="rounded-lg mb-4 py-4 px-4">
                  <div>To</div>
                  <div class="d-flex mt-2">
                    <img
                      class="mr-4"
                      width="40"
                      height="24"
                      :src="toNetwork.icon"
                    />
                    <p>{{ toNetwork.label }}</p>
                    <v-spacer></v-spacer>
                    <p>+ {{ fromPrice }}</p>
                  </div>
                </v-card>

                <v-card
                  
                  outlined
                  color="grey"
                  v-if="toLoading"
                  class="rounded-lg mb-8 pt-3 px-4"
                >
                  <div class="d-flex">
                    <p>{{ toNetwork.label }} Status</p>

                    <v-spacer></v-spacer>
                    <v-progress-circular
                      indeterminate
                      color="primary"
                    ></v-progress-circular>
                  </div>
                </v-card>
                <div class="d-flex">
                  <p>Crosshain Fee:</p>
                  <v-spacer></v-spacer>
                  <p>
                    {{
                      Intl.NumberFormat("en-US", {}).format(
                        poolNetwork.MinimumSwapFee
                      ) +
                      " - " +
                      Intl.NumberFormat("en-US", {}).format(
                        poolNetwork.MaximumSwapFee
                      )
                    }}
                    ARV
                  </p>
                </div>
                <div class="d-flex">
                  <p>Estimated time of arrival:</p>
                  <v-spacer></v-spacer>
                  <p>3-30 min</p>
                </div>

                <v-divider></v-divider>

                <v-btn
                  @click="swap"
                  rounded
                  small
                  depressed
                  color="#CE45F7"
                  class="ml-2 py-6 px-16 rounded mt-6"
                  :loading="loading"
                  dark
                  >Confirm</v-btn
                >
              </v-card-text>
            </v-card>
          </v-dialog>
        </div>
      </v-sheet>
    </v-card-text>
  </v-card>
  
</template>


<script>
import networks from "../networks.json";
import pools from "../pools.json";
import WalletOption from "../layouts/WalletOption";
import { loadBlockchain } from "../store/nft";
import ERC20 from "../store/ERC20.json";


export var arvContracts = {
  erc20: null,
};

var Web3 = require("web3");

// https://bridgeapi.anyswap.exchange/v2/serverInfo/4
// token id = arvv5
// anySwapOutNative(address token, address to, uint256 toChainID)

// address being called (contract): 0xBa8Da9dcF11B50B03fd5284f164Ef5cdEF910705
// token address: 0x0615Dbba33Fe61a31c7eD131BDA6655Ed76748B1
// to addrress: 0x6313eB1a676377d1A2f96b383606bbeF5FeD2F1F

// does a transfer to deposit addess on the recipient chain DepositAddress

// https://bridgeapi.anyswap.exchange/merge/tokenlist/137

// "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2":{
//          "logoUrl":"https://assets.coingecko.com/coins/images/279/large/ethereum.png",
//          "name":"WrappedEther",
//          "symbol":"WETH",
//          "decimals":18,
//          "anyToken":"0x0615dbba33fe61a31c7ed131bda6655ed76748b1",
//          "liquidity":"705623319505647442074"
//       },

export default {
  name: "Home",
  components: {
    WalletOption,
  },
  data() {
    return {
      loading: false,
      fromLoading: false,
      toLoading: false,
      networks: [],
      toNetworks: [],
      fromNetwork: null,
      toNetwork: null,
      toPrice: this.fromPrice,
      fromPrice: null,
      poolNetwork: null,
      fromTransactionHash: null,
      transferCompleted: false,
      priceRules: [
        (v) => !!v || "Amount is required",
        (v) =>
          v > this.poolNetwork.MinimumSwap ||
          `Amount must be greater than ${this.poolNetwork.MinimumSwap}`,
        (v) =>
          v < this.poolNetwork.MaximumSwap ||
          `Amount must be less than ${this.poolNetwork.MaximumSwap}`,
      ],
      showDialog: false,
      wallet_balance: null,
    };
  },
  created() {
    Object.keys(networks).forEach((element) => {
      this.networks.push(networks[element]);
    });

    if (window.web3?.currentProvider) {
      this.fromNetwork = networks[window.web3.currentProvider.networkVersion];
    }
    if (!this.fromNetwork) {
      this.fromNetwork = networks[1];
    }
    this.setPools(this.fromNetwork.id);
  },
  computed: {
    walletData() {
      return this.$store.state.walletData;
    },
  },
  methods: {
    confirm() {
      var valid = this.$refs.form.validate();
      if (!valid) return;
      this.showDialog = true;
    },
    async connect(provider) {
      var data = await loadBlockchain(provider);
      if (!data) {
        this.$store.commit("updateSnackBar", {
          show: true,
          message: "Could not load wallet",
          variant: "error",
        });
        return;
      }
      this.$store.commit("updateWallet", data);
      let tokenAddress = pools[this.fromNetwork.id].address;
      let fromAddress = this.walletData.accounts[0]; // Your address
      arvContracts.erc20 = new window.web3.eth.Contract(
        ERC20.abi,
        tokenAddress,
        {
          from: fromAddress,
        }
      );

      await arvContracts.erc20.methods
        .balanceOf(fromAddress)
        .call((err, res) => {
          console.log(res, err);
          this.wallet_balance = Math.ceil(res / 10 ** 18);
        });
    },
    async swap() {
      var valid = this.$refs.form.validate();
      if (!valid) return;
      this.loading = true;
      this.makeTransfer();
    },
    makeTransfer() {
      this.fromLoading = true;
      let toAddress = this.poolNetwork.DepositAddress;
      let contract = arvContracts.erc20;

      let amount = window.web3.utils.toWei(this.fromPrice, "ether");
      contract.methods
        .transfer(toAddress, amount)
        .send({ from: this.walletData.accounts[0] })
        .on("error", (error, receipt) => {
          this.loading = false;
          this.fromLoading = false;
          this.$store.commit("updateSnackBar", {
            show: true,
            message: "Error making transafer",
            variant: "error",
          });
          console.log(error, receipt);
        })
        .on("receipt", (receipt) => {
          console.log(receipt, receipt.events, "transfer");
          this.loading = false;
          this.fromLoading = false;
          this.toLoading = true;
          this.fromTransactionHash = receipt.transactionHash;
          this.transferCompleted = true;
          this.showDialog = false;
          this.$store.commit("updateSnackBar", {
            show: true,
            message: "Transfer successfull, token will arive soon",
            variant: "success",
          });
        });
    },
    async changeChainNetwork(type, chain) {
      console.log(chain, "network chain");

      if (window.web3.currentProvider && type == "from") {
        this.setPools(this.fromNetwork.id);
        await window.web3.currentProvider.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: Web3.utils.toHex(chain.id),
              chainName: chain.label,
              nativeCurrency: {
                name: chain.currency,
                symbol: chain.currency,
                decimals: 18,
              },
              rpcUrls: [chain.rpcUrl],
              blockExplorerUrls: [chain.blockExplorerUrls],
            },
          ],
        });

        window.web3.currentProvider
          .request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: Web3.utils.toHex(chain.id) }],
          })
          .catch((error) => {
            this.$store.commit("updateSnackBar", {
              show: true,
              message: "Network chain support needs to be added to wallet",
              variant: "error",
            });
            console.log(error);
          });
      }
    },
    setPools(networkId) {
      this.toNetworks = [];
      Object.keys(pools[networkId].destChains).forEach((element) => {
        this.toNetworks.push(networks[element]);
      });
      this.toNetwork = this.toNetworks[0];

      this.poolNetwork = pools[networkId].destChains[this.toNetwork.id];

      console.log(
        this.poolNetwork,
        this.toNetwork?.id ?? this.toNetworks[0].id,
        pools[networkId].destChains
      );
    },
  },

};



</script>

<style scoped>
.disclaimer{
  list-style-position: inside;
  text-align: left;
  font-size: 11px;
  margin-top: 30px;
  padding: 0px;
  margin-bottom: -15px;
}
.disclaimer span{
  font-weight: 900;
  font-size: 12px;
}
.vcardwrap {
  display: flex;
  padding-top: 14px;
  padding-left: 14px;
  padding-right: 14px;
  font-size: 11px;
}
.v-card {
  margin-bottom: 10px;
}
.wrapper {
  position: relative;
  
  border-color: 2px solid #ab48e0;
  border-radius: 15px;
  /* box-shadow: 0 0 38px 8px #ab48e0; */
  position: relative;
  transform: translate(0);
  transform-style: preserve-3d;
}
.wrapper:before {
  content: '';
  position: absolute;
  inset: -5px;
  transform: translate3d(1px, 2px, -1px);
  background: conic-gradient(
    from 90deg at 40% -25%,
    #e00af8,
    #e00af8,
    #c716f8,
    #743ff6,
    #743ff6,
    #743ff6,
    #3f58f5,
    #3f58f5,
    #3f58f5,
    #743ff6,
    #743ff6,
    #743ff6,
    #c716f8,
    #c716f8,
    #e00af8,
    #e00af8
  );
  filter: blur(10px);
}
.header {
  font-weight: 900;
  font-size: 20px;
  margin-bottom: 10px;
  
}
.v-card {
  width: 530px;
}

.closebutton {
 border: 1px solid #ab48e0;
 width: 35px;
 height: 35px;
 border-radius: 50%;
 text-align: center;
 font-size: 13px;
 color: #ab48e0;
 transition: all 0.5s ease;
}
.closebutton:hover {
  background-color: #d204fcda;
  color: #fff;
  font-size: 14px;
}
.addresstitle {
  text-align: center;
  display: flex;
  margin: auto;
  justify-content: center;
  padding-bottom: 10px;
  font-size: 12px;
}

</style>
