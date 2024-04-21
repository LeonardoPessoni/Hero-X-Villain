const { createApp } = Vue;

createApp({
    data() {
        return {
            heroi: { vida: 100, defendendo: false, reducaoDano: 0 }, // Dados do herói, incluindo vida, estado de defesa e redução de dano
            vilao: { vida: 100, defendendo: false }, // Dados do vilão, incluindo vida e estado de defesa
            heroiImg: '/images/hero/inicial.gif',
            vilaoImg: '/images/villain/inicial.gif',
            correrCount: 0, // Contador de vezes que o herói correu
            mensagemStatus: "A melhor pegada de varinhas ganha", // Mensagem de status exibida no jogo
            jogoAtivo: true
        }
    },

    methods: {
        // Método para atacar, recebe um booleano indicando se é o herói que está atacando
        atacar(isHeroi) {
            if (!this.jogoAtivo) return;
            if (isHeroi) {
                this.heroiImg = '/images/hero/ataque.gif';
                setTimeout(() => {
                    this.heroiImg = '/images/hero/inicial.gif';
                }, 3000);
                this.vilao.vida -= 10;
                this.verificarVida();
                this.acaoVilao();
            } else {
                this.heroi.vida -= 20;
                this.verificarVida();
            }
        },
        // Método para defender, recebe um booleano indicando se é o herói que está defendendo
        defender(isHeroi) {
            if (!this.jogoAtivo) return;
            if (isHeroi) {
                this.heroi.defendendo = true;
                this.heroi.reducaoDano = 0.95; // Define redução de dano de 5%
                this.heroiImg = '/images/hero/defende.gif';
                setTimeout(() => {
                    this.heroiImg = '/images/hero/inicial.gif';
                    this.heroi.defendendo = false;
                }, 3000);
                this.acaoVilao();
            }
        },
        // Método para usar poção de cura, recebe um booleano indicando se é o herói que está usando a poção
        usarPocao(isHeroi) {
            if (!this.jogoAtivo) return;
            if (isHeroi) {
                this.heroiImg = '/images/hero/pocao.gif';
                setTimeout(() => {
                    this.heroiImg = '/images/hero/inicial.gif';
                }, 3000);
                this.heroi.vida += 30;
                this.heroi.vida = Math.min(this.heroi.vida, 100);
                this.verificarVida();
                this.acaoVilao();
            }
        },
        // Método para correr, recebe um booleano indicando se é o herói que está correndo
        correr(isHeroi) {
            if (!this.jogoAtivo) return;
            if (isHeroi) {
                if (this.correrCount < 3) {
                    this.heroiImg = '/images/hero/correndo.webp';
                    setTimeout(() => {
                        this.heroiImg = '/images/hero/inicial.gif';
                    }, 3000);
                    this.correrCount++;
                    this.acaoVilao();
                } else {
                    this.mensagemStatus = "Você não pode mais correr!";
                }
            }
        },

        // Método para determinar a ação do vilão (Aleatóriamente)
        acaoVilao() {
            // Verifica se o jogo está ativo
            if (!this.jogoAtivo) return;
            // Lógica para determinar a ação aleatória do vilão
            const acoes = ['atacar', 'defender', 'usarPocao', 'correr'];
            const acaoAleatoria = acoes[Math.floor(Math.random() * acoes.length)];
            switch (acaoAleatoria) {
                case 'atacar':
                    this.vilaoImg = '/images/villain/ataque.gif';
                    setTimeout(() => {
                        this.vilaoImg = '/images/villain/inicial.gif';
                    }, 3000);
                    let dano = 20;
                    if (this.heroi.defendendo && this.heroi.reducaoDano > 0) {
                        dano *= this.heroi.reducaoDano;
                        this.heroi.reducaoDano = 0; // Reset após o uso
                    }
                    this.heroi.vida -= dano;
                    break;
                case 'defender':
                    this.vilao.defendendo = true;
                    this.vilaoImg = '/images/villain/defende.gif';
                    setTimeout(() => {
                        this.vilaoImg = '/images/villain/inicial.gif';
                        this.vilao.defendendo = false;
                    }, 3000);
                    break;
                case 'usarPocao':
                    this.vilaoImg = '/images/villain/pocao.gif';
                    setTimeout(() => {
                        this.vilaoImg = '/images/villain/inicial.gif';
                    }, 3000);
                    this.vilao.vida += 30;
                    this.vilao.vida = Math.min(this.vilao.vida, 100);
                    break;
                case 'correr':
                    this.vilaoImg = '/images/villain/correndo.gif';
                    setTimeout(() => {
                        this.vilaoImg = '/images/villain/inicial.gif';
                    }, 3000);
                    break;
            }
        },
        // Método para verificar a vida do herói e do vilão e atualizar o status do jogo
        verificarVida() {
            if (this.heroi.vida <= "0" || this.heroi.vida === "0") {
                this.mensagemStatus = "Você perdeu, você é um bruxo fraco! (ou não teve sorte)";
                this.heroi.vida = 0; // Garante que a vida não fique negativa.
                this.finalizarJogo();
            } else if (this.vilao.vida <= 0 || this.vilao.vida === 0) {
                this.mensagemStatus = "Você ganhou, você é um bruxo forte! (ou teve sorte)";
                this.vilao.vida = 0; // Garante que a vida não fique negativa.
                this.finalizarJogo();
            }
        },
        // Define o jogo como inativo
        finalizarJogo() {
            this.jogoAtivo = false;
        }
    }
}).mount("#app");
