using Microsoft.AspNetCore.Mvc;
using TaskFlow.Api.DTOs;
using TaskFlow.Api.Models;
using TaskFlow.Api.Services;

namespace TaskFlow.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Produces("application/json")]
    public class TarefasController(TarefaService service) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<List<TarefaResponse>>> ListarAsync(
            [FromQuery] StatusTarefa? status = null)
        {
            var tarefas = await service.ListarAsync(status);
            return Ok(tarefas);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TarefaResponse>> BuscarIdAsync(int id)
        {
            var tarefa = await service.BuscarIdAsync(id);
            if (tarefa is null)
                return NotFound(new { Message = "Tarefa não encontrada" });

            return Ok(tarefa);
        }

        [HttpPost]
        public async Task<ActionResult<TarefaResponse>> CriarAsync(TarefaRequest request)
        {
            var tarefa = await service.CriarAsync(request);
            return StatusCode(201, tarefa); // 201 - created.
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<TarefaResponse>> AtualizarAsync(int id, TarefaRequest request)
        {
            try
            {
                var tarefa = await service.AtualizarAsync(id, request);
                return Ok(tarefa);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { Message = $"Tarefa {id} não encontrada" });
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeletarAsync(int id)
        {
            try
            {
                await service.DeletarAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { Message = $"Tarefa {id} não encontrada" });
            }
        }
    }
}
