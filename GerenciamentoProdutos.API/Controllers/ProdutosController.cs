using GerenciamentoProdutos.Data.Context;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GerenciamentoProdutos.Domain.Entities;

namespace GerenciamentoProdutos.API.Controllers;
[Route("api/[controller]")]
[ApiController]
public class ProdutosController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ProdutosController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet] //   - api/produtos
    public async Task<IActionResult> GetProdutos()
    {
        var produtos = await _context.Produtos.ToListAsync();
        return Ok(produtos);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetProdutosById(int id)
    {
        var produto = await _context.Produtos.FindAsync(id);
        if (produto == null)
        {
            return BadRequest();
        }
        return Ok(produto);
    }

    [HttpPost]
    public async Task<IActionResult> PostProduto(Produto produto)
    {
        _context.Produtos.Add(produto);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetProdutos), new { id = produto.Id }, produto);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutProduto(int id, Produto produto)
    {
        if (id != produto.Id)
        {
            return BadRequest();
        }

        var existingProduto = await _context.Produtos.FindAsync(id);
        if (existingProduto == null)
        {
            return NotFound();
        }

        existingProduto.Nome = produto.Nome;
        existingProduto.Descricao = produto.Descricao;
        existingProduto.Preco = produto.Preco;
        existingProduto.Categoria = produto.Categoria;

        await _context.SaveChangesAsync();

        return NoContent();
    }


    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduto(int id)
    {
        var produto = await _context.Produtos.FindAsync(id);
        if (produto == null)
        {
            return NotFound();
        }
        _context.Produtos.Remove(produto);
        await _context.SaveChangesAsync();
        return NoContent();
    }

}
