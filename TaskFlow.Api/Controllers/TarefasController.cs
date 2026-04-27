using Microsoft.AspNetCore.Mvc;
using TaskFlow.Api.DTOs;
using TaskFlow.Api.Models;
using TaskFlow.Api.Services;

namespace TaskFlow.Api.Controllers
{
    /// <summary>
    /// Gerencia as operações CRUD de tarefas.
    /// </summary>
    /// <remarks>
    /// Os status codes de resposta seguem as <see cref="DefaultApiConventions"/>
    /// definidas no assembly. O único desvio é o <c>PUT</c>, que retorna
    /// <c>204 No Content</c> em vez do corpo atualizado — o cliente deve
    /// recarregar o recurso com um <c>GET</c> subsequente se necessário.
    /// </remarks>
    [Route("api/[controller]")]
    [ApiController]
    [Produces("application/json")]
    public class TarefasController(TarefaService service) : ControllerBase
    {
        /// <summary>
        /// Retorna todas as tarefas, com filtro opcional por status.
        /// </summary>
        /// <param name="status">
        /// Filtra as tarefas pelo status informado.
        /// Valores aceitos: <c>Pendente</c>, <c>EmAndamento</c>, <c>Concluida</c>.
        /// Quando omitido, retorna todas as tarefas independentemente do status.
        /// </param>
        /// <returns>Lista de tarefas ordenada por data de criação decrescente.</returns>
        [HttpGet]
        public async Task<ActionResult<List<TarefaResponse>>> GetAsync(
            [FromQuery] StatusTarefa? status = null)
        {
            var tarefas = await service.GetAsync(status);
            return Ok(tarefas);
        }

        /// <summary>
        /// Retorna uma tarefa pelo seu identificador único.
        /// </summary>
        /// <param name="id">Identificador da tarefa.</param>
        /// <returns>Dados completos da tarefa encontrada.</returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<TarefaResponse>> GetByIdAsync(int id)
        {
            var tarefa = await service.GetByIdAsync(id);
            if (tarefa is null)
                return NotFound(new { Message = "Tarefa não encontrada" });

            return Ok(tarefa);
        }

        /// <summary>
        /// Cria uma nova tarefa.
        /// </summary>
        /// <remarks>
        /// O status inicial é sempre <c>Pendente</c>, independentemente do valor
        /// enviado no corpo da requisição. As datas de início e conclusão são
        /// gerenciadas internamente pela API conforme o status evolui.
        /// </remarks>
        /// <param name="request">Dados da tarefa a ser criada.</param>
        /// <returns>
        /// A tarefa criada, com o cabeçalho <c>Location</c> apontando para
        /// o endpoint <c>GET /api/tarefas/{id}</c> do recurso recém-criado.
        /// </returns>
        [HttpPost]
        public async Task<ActionResult<TarefaResponse>> PostAsync(TarefaRequest request)
        {
            var tarefa = await service.PostAsync(request);
            return CreatedAtAction("GetById", new { id = tarefa.Id }, tarefa);
        }

        /// <summary>
        /// Atualiza os dados de uma tarefa existente.
        /// </summary>
        /// <remarks>
        /// Atualiza título, descrição e status da tarefa. A transição de status
        /// gerencia automaticamente as datas de ciclo de vida:
        /// <list type="bullet">
        ///   <item><description>
        ///     <c>Pendente</c> — zera <c>DataInicio</c> e <c>DataConclusao</c>.
        ///   </description></item>
        ///   <item><description>
        ///     <c>EmAndamento</c> — define <c>DataInicio</c> (somente na primeira
        ///     transição para este status; não sobrescreve se já definida).
        ///   </description></item>
        ///   <item><description>
        ///     <c>Concluida</c> — define <c>DataConclusao</c> com o momento atual.
        ///   </description></item>
        /// </list>
        /// Espaços no início e fim de <c>Titulo</c> e <c>Descricao</c> são removidos
        /// automaticamente antes de persistir.
        /// </remarks>
        /// <param name="id">Identificador da tarefa a ser atualizada.</param>
        /// <param name="request">Novos dados da tarefa.</param>
        [HttpPut("{id}")]
        public async Task<ActionResult> PutAsync(int id, TarefaRequest request)
        {
            try
            {
                await service.PutAsync(id, request);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { Message = $"Tarefa {id} não encontrada" });
            }
        }

        /// <summary>
        /// Remove uma tarefa permanentemente.
        /// </summary>
        /// <param name="id">Identificador da tarefa a ser removida.</param>
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteAsync(int id)
        {
            try
            {
                await service.DeleteAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { Message = $"Tarefa {id} não encontrada" });
            }
        }
    }
}
