import { Component, OnInit, signal } from '@angular/core';
import { Produto } from './models/produto.model';
import { Produtos } from './services/produtos';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  produtos = signal<Produto[]>([]);

  // Busca por ID
  idBusca = signal<number | null>(null);
  produtoEncontrado = signal<Produto | null>(null);
  mensagemBusca = signal('');

  // Cadastro de produto
  nomeNovoProduto = signal('');
  precoNovoProduto = signal<number | null>(null);
  mensagemCadastro = signal('');

  // Edição de produto
idEdicao = signal<number | null>(null);
nomeEdicao = signal('');
precoEdicao = signal<number | null>(null);
mensagemEdicao = signal('');

// Remoção de produto
mensagemRemocao = signal('');

  constructor(private produtosService: Produtos) {}

  ngOnInit(): void {
    this.carregarProdutos();
  }

  carregarProdutos(): void {
    this.produtosService.listarTodos().subscribe({
      next: (produtos) => {
        this.produtos.set(produtos);
      },
      error: (erro) => {
        console.error('Erro ao carregar produtos:', erro);
      }
    });
  }

  buscarProduto(): void {
    const id = this.idBusca();

    // Limpa o resultado da busca anterior
    this.produtoEncontrado.set(null);
    this.mensagemBusca.set('');

    if (id === null || Number.isNaN(id) || id <= 0) {
      this.mensagemBusca.set('Digite um ID válido.');
      return;
    }

    this.produtosService.buscarPorId(id).subscribe({
      next: (produto) => {
        this.produtoEncontrado.set(produto);
      },
      error: (erro) => {
        console.error('Erro ao buscar produto:', erro);

        if (erro.status === 404) {
          this.mensagemBusca.set('Produto não encontrado.');
        } else {
          this.mensagemBusca.set('Erro ao buscar produto.');
        }
      }
    });
  }

  adicionarProduto(): void {
    const nome = this.nomeNovoProduto().trim();
    const preco = this.precoNovoProduto();

    this.mensagemCadastro.set('');

    if (!nome || preco === null || Number.isNaN(preco) || preco <= 0) {
      this.mensagemCadastro.set('Preencha nome e preço corretamente.');
      return;
    }

    this.produtosService.criar({
      nome: nome,
      preco: preco
    }).subscribe({
      next: () => {
        this.mensagemCadastro.set('Produto cadastrado com sucesso.');

        this.nomeNovoProduto.set('');
        this.precoNovoProduto.set(null);

        this.carregarProdutos();
      },
      error: (erro) => {
        console.error('Erro ao cadastrar produto:', erro);
        this.mensagemCadastro.set('Erro ao cadastrar produto.');
      }
    });
  }

  iniciarEdicao(produto: Produto): void {
  this.idEdicao.set(produto.id);
  this.nomeEdicao.set(produto.nome);
  this.precoEdicao.set(produto.preco);
  this.mensagemEdicao.set('');
}

cancelarEdicao(): void {
  this.idEdicao.set(null);
  this.nomeEdicao.set('');
  this.precoEdicao.set(null);
  this.mensagemEdicao.set('');
}

salvarEdicao(): void {
  const id = this.idEdicao();
  const nome = this.nomeEdicao().trim();
  const preco = this.precoEdicao();

  if (
    id === null ||
    !nome ||
    preco === null ||
    Number.isNaN(preco) ||
    preco <= 0
  ) {
    this.mensagemEdicao.set('Preencha nome e preço corretamente.');
    return;
  }

  this.produtosService.atualizar(id, {
    nome: nome,
    preco: preco
  }).subscribe({
    next: () => {
      this.mensagemEdicao.set('Produto atualizado com sucesso.');

      this.idEdicao.set(null);
      this.nomeEdicao.set('');
      this.precoEdicao.set(null);

      this.carregarProdutos();
    },
    error: (erro) => {
      console.error('Erro ao atualizar produto:', erro);
      this.mensagemEdicao.set('Erro ao atualizar produto.');
    }
  });
}

removerProduto(id: number): void {
  this.mensagemRemocao.set('');

  this.produtosService.remover(id).subscribe({
    next: () => {
      this.mensagemRemocao.set('Produto removido com sucesso.');
      this.carregarProdutos();
    },
    error: (erro) => {
      console.error('Erro ao remover produto:', erro);
      this.mensagemRemocao.set('Erro ao remover produto.');
    }
  });
}
}