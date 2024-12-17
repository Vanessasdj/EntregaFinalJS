const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

const pontuacao = document.querySelector(".valor--pontuacao")
const melhorPontuacao = document.querySelectorAll(".valor--pontuacao")[1]
const pontuacaoFinal = document.querySelector(".pontuacao-final > span")
const menu = document.querySelector(".tela-menu")
const botaoPlay = document.querySelector(".botao-play")

const audio = new Audio("audio.mp3")

const tamanho = 30

const posicaoInicial = { x: 270, y: 240 }

let cobrinha = [posicaoInicial]

const incrementarPontuacao = () => {
    pontuacao.innerText = +pontuacao.innerText + 10
}

const randomizarNumero = (min, max) => {
    return Math.round(Math.random() * (max - min) + min)
}

const randomizarPosicao = () => {
    const numero = randomizarNumero(0, canvas.width - tamanho)
    return Math.round(numero / 30) * 30
}

const randomizarCor = () => {
    const red = randomizarNumero(0, 255)
    const green = randomizarNumero(0, 255)
    const blue = randomizarNumero(0, 255)

    return `rgb(${red}, ${green}, ${blue})`
}

const comida = {
    x: randomizarPosicao(),
    y: randomizarPosicao(),
    color: randomizarCor()
}

let direcao, loopId

const desenharComida = () => {
    const { x, y, color } = comida

    ctx.shadowColor = color
    ctx.shadowBlur = 6
    ctx.fillStyle = color
    ctx.fillRect(x, y, tamanho, tamanho)
    ctx.shadowBlur = 0
}

const desenharCobrinha = () => {
    ctx.fillStyle = "#ddd"

    cobrinha.forEach((posicao, index) => {
        if (index == cobrinha.length - 1) {
            ctx.fillStyle = "white"
        }

        ctx.fillRect(posicao.x, posicao.y, tamanho, tamanho)
    })
}

const moverCobrinha = () => {
    if (!direcao) return

    const cabeca = cobrinha[cobrinha.length - 1]

    if (direcao == "right") {
        cobrinha.push({ x: cabeca.x + tamanho, y: cabeca.y })
    }

    if (direcao == "left") {
        cobrinha.push({ x: cabeca.x - tamanho, y: cabeca.y })
    }

    if (direcao == "down") {
        cobrinha.push({ x: cabeca.x, y: cabeca.y + tamanho })
    }

    if (direcao == "up") {
        cobrinha.push({ x: cabeca.x, y: cabeca.y - tamanho })
    }

    cobrinha.shift()
}

const desenharGrade = () => {
    ctx.lineWidth = 1
    ctx.strokeStyle = "#191919"

    for (let i = 30; i < canvas.width; i += 30) {
        ctx.beginPath()
        ctx.lineTo(i, 0)
        ctx.lineTo(i, 600)
        ctx.stroke()

        ctx.beginPath()
        ctx.lineTo(0, i)
        ctx.lineTo(600, i)
        ctx.stroke()
    }
}

const comerComida = () => {
    const cabeca = cobrinha[cobrinha.length - 1]

    if (cabeca.x == comida.x && cabeca.y == comida.y) {
        incrementarPontuacao()
        cobrinha.push(cabeca)
        audio.play()

        let x = randomizarPosicao()
        let y = randomizarPosicao()

        while (cobrinha.find((posicao) => posicao.x == x && posicao.y == y)) {
            x = randomizarPosicao()
            y = randomizarPosicao()
        }

        comida.x = x
        comida.y = y
        comida.color = randomizarCor()
    }
}

const checarColisao = () => {
    const cabeca = cobrinha[cobrinha.length - 1]
    const limiteCanvas = canvas.width - tamanho
    const pescoco = cobrinha.length - 2

    const colisaoParede =
    cabeca.x < 0 || cabeca.x > limiteCanvas || cabeca.y < 0 || cabeca.y > limiteCanvas

    const autoColisao = cobrinha.find((posicao, index) => {
        return index < pescoco && posicao.x == cabeca.x && posicao.y == cabeca.y
    })

    if (colisaoParede || autoColisao) {
        fimJogo()
    }
}

const carregarMelhorPontuacao = () => {
    const melhor = localStorage.getItem("melhorPontuacao") || 0
    melhorPontuacao.innerText = melhor
}

const atualizarMelhorPontuacao = (pontuacaoAtual) => {
    const melhor = parseInt(localStorage.getItem("melhorPontuacao") || 0)
    if (pontuacaoAtual > melhor) {
        localStorage.setItem("melhorPontuacao", pontuacaoAtual)
        melhorPontuacao.innerText = pontuacaoAtual
    }
}

carregarMelhorPontuacao()


const fimJogo = () => {
    direcao = undefined

    const pontuacaoAtual = parseInt(pontuacao.innerText);
    atualizarMelhorPontuacao(pontuacaoAtual);

    menu.style.display = "flex"
    pontuacaoFinal.innerText = pontuacao.innerText
    canvas.style.filter = "blur(2px)"
}

const loopJogo = () => {
    clearInterval(loopId)

    ctx.clearRect(0, 0, 600, 600)
    desenharGrade()
    desenharComida()
    moverCobrinha()
    desenharCobrinha()
    comerComida()
    checarColisao()

    loopId = setTimeout(() => {
        loopJogo()
    }, 300)
}

loopJogo()

document.addEventListener("keydown", ({ key }) => {
    if (key == "ArrowRight" && direcao != "left") {
        direcao = "right"
    }

    if (key == "ArrowLeft" && direcao != "right") {
        direcao = "left"
    }

    if (key == "ArrowDown" && direcao != "up") {
        direcao = "down"
    }

    if (key == "ArrowUp" && direcao != "down") {
        direcao = "up"
    }
})

botaoPlay.addEventListener("click", () => {
    pontuacao.innerText = "00"
    menu.style.display = "none"
    canvas.style.filter = "none"

    cobrinha = [posicaoInicial]
})

