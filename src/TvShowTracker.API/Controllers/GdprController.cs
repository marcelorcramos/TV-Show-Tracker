using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TvShowTracker.Application.Interfaces;

namespace TvShowTracker.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class GdprController : ControllerBase
    {
        private readonly IGdprService _gdprService;

        public GdprController(IGdprService gdprService)
        {
            _gdprService = gdprService;
        }

        [HttpGet("export-data")]
        public async Task<ActionResult<UserDataDto>> ExportUserData()
        {
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
            var userData = await _gdprService.ExportUserDataAsync(userId);
            return Ok(userData);
        }

        [HttpDelete("delete-account")]
        public async Task<ActionResult> DeleteAccount()
        {
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
            var result = await _gdprService.DeleteUserAccountAsync(userId);
            
            if (result)
            {
                return Ok(new { message = "Account deleted successfully" });
            }
            else
            {
                return BadRequest(new { message = "Failed to delete account" });
            }
        }

        [HttpPost("anonymize-data")]
        public async Task<ActionResult> AnonymizeData()
        {
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
            await _gdprService.AnonymizeUserDataAsync(userId);
            return Ok(new { message = "Data anonymized successfully" });
        }
    }
}