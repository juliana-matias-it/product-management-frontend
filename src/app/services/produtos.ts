import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Produto } from '../models/produto.model';

@Injectable({
  providedIn: 'root'
})
export class Produtos {

 private apiUrl = 'http://localhost:5220/api/Produtos';

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.apiUrl}/${id}`);
  }

  criar(produto: { nome: string; preco: number }): Observable<string> {
  return this.http.post(
    this.apiUrl,
    produto,
    { responseType: 'text' }
  );
}

 atualizar(
  id: number,
  produto: { nome: string; preco: number }
): Observable<string> {
  return this.http.put(
    `${this.apiUrl}/${id}`,
    produto,
    { responseType: 'text' }
  );
}

  remover(id: number): Observable<string> {
  return this.http.delete(
    `${this.apiUrl}/${id}`,
    { responseType: 'text' }
  );
}
}