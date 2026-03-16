export const emailService = {
    async sendRecommendationEmail(userEmail, recommendations) {
      console.log('Preparando e-mail de recomendações para:', userEmail);
      console.log('Recomendações:', recommendations.map(r => r.title));
      
      try {
        // Simular delay de envio
        await new Promise(resolve => setTimeout(resolve, 1000));
      
        const emailContent = this.generateEmailContent(userEmail, recommendations);
        console.log('Conteúdo do e-mail:', emailContent);
        
        console.log('E-mail simulado enviado com sucesso para:', userEmail);
        return true;
        
      } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
        return false;
      }
    },
  
    generateEmailContent(userEmail, recommendations) {
      return {
        to: userEmail,
        subject: 'Suas Recomendações Personalizadas de TV Shows',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Olá!</h2>
            <p>Baseado nos seus gostos, aqui estão algumas recomendações especiais para você:</p>
            
            ${recommendations.map(show => `
              <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0;">
                <h3 style="color: #1e293b; margin: 0 0 8px 0;">${show.title}</h3>
                <p style="margin: 4px 0; color: #64748b;">
                  <strong>Gênero:</strong> ${show.genre || 'N/A'} | 
                  <strong>Tipo:</strong> ${show.type || 'N/A'} | 
                  <strong>Rating:</strong> ${show.rating || 'N/A'}
                </p>
                ${show.description ? `<p style="margin: 8px 0;">${show.description}</p>` : ''}
              </div>
            `).join('')}
            
            <p style="color: #64748b; font-size: 14px;">
              Acesse o TV Show Tracker para descobrir mais conteúdos incríveis!
            </p>
            
            <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin-top: 24px;">
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                Você está recebendo este e-mail porque optou por receber recomendações.<br>
                Para alterar suas preferências, acesse seu perfil no TV Show Tracker.
              </p>
            </div>
          </div>
        `
      };
    },
  
    async testEmail() {
      const testRecommendations = [
        {
          title: 'Stranger Things',
          genre: 'Sci-Fi',
          type: 'Series',
          rating: 8.7,
          description: 'Um grupo de amigos investiga o desaparecimento de um colega e encontra experimentos secretos do governo.'
        },
        {
          title: 'The Crown',
          genre: 'Drama',
          type: 'Series', 
          rating: 8.6,
          description: 'A vida da Rainha Elizabeth II desde seus primeiros dias até os eventos históricos que moldaram o século XX.'
        }
      ];
      
      return await this.sendRecommendationEmail('test@example.com', testRecommendations);
    }
  };