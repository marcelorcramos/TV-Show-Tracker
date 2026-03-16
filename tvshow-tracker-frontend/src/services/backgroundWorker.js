// src/services/backgroundWorker.js - VERSÃO CORRIGIDA
import { emailService } from './emailService';
import { authAPI, tvShowsAPI } from './api';

class BackgroundWorker {
  constructor() {
    this.isRunning = false;
    this.interval = null;
    this.checkInterval = 5 * 60 * 1000; //5 min teste
  }

    start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('Trabalhador em segundo plano iniciado');
    
    setTimeout(() => {
      this.checkAndSendRecommendations();
    }, 2000);
  
    this.interval = setInterval(() => {
      this.checkAndSendRecommendations();
    }, this.checkInterval);
  }

  stop() {
    this.isRunning = false;
    if (this.interval) {
      clearInterval(this.interval);
    }
    console.log('🛑 Trabalhador em segundo plano parado');
  }

  async checkAndSendRecommendations() {
    try {
      console.log('🔍 Verificando recomendações para e-mail...');
      
      // Verificação se usuário está autenticado
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.log('Usuário não autenticado, pulando verificação de e-mails');
        return;
      }

      // Obter preferências do usuário atual
      const userEmail = localStorage.getItem('userEmail');
      const emailPreference = localStorage.getItem('emailNotifications') === 'true';
      
      if (!userEmail || !emailPreference) {
        console.log('Usuário não optou por receber e-mails ou e-mail não encontrado');
        return;
      }

      console.log('Preparando para enviar recomendações para:', userEmail);
      
      // Buscar recomendações reais da API
      const recommendations = await this.getUserRecommendations();
      
      if (recommendations.length > 0) {
        const success = await emailService.sendRecommendationEmail(
          userEmail, 
          recommendations
        );
        
        if (success) {
          console.log('E-mail enviado para:', userEmail);
          this.updateLastEmailSent();
        } else {
          console.log('Falha ao enviar e-mail para:', userEmail);
        }
      } else {
        console.log('Nenhuma recomendação encontrada para:', userEmail);
      }
    } catch (error) {
      console.error('Erro no trabalhador em segundo plano:', error);
    }
  }

  async getUserRecommendations() {
    try {
      console.log('Buscando recomendações da API...');
      
      // Buscar recomendações reais da API
      const response = await tvShowsAPI.getRecommendations();
      const recommendations = response.data;
      
      console.log(`${recommendations.length} recomendações encontradas`);
      
      return recommendations.map(show => ({
        id: show.id,
        title: show.title,
        genre: show.genre,
        type: show.type,
        rating: show.rating,
        description: show.description,
        releaseDate: show.releaseDate
      }));
      
    } catch (error) {
      console.error('Erro ao buscar recomendações:', error);
      
      // Buscar dos favoritos locais
      return this.getFallbackRecommendations();
    }
  }

  getFallbackRecommendations() {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (favorites.length === 0) {
      console.log('Nenhum favorito encontrado para fallback');
      return [];
    }
    
    console.log(`Usando ${favorites.length} favoritos para fallback`);
    
    return favorites.slice(0, 3).map(fav => ({
      id: fav.id,
      title: fav.title,
      genre: fav.genre,
      type: fav.type,
      rating: fav.rating,
      description: fav.description
    }));
  }

  updateLastEmailSent() {
    const userId = 1; // Em produção, obter do usuário logado
    localStorage.setItem(`lastEmailSent_${userId}`, new Date().toISOString());
    console.log('📅 Último e-mail registrado em:', new Date().toISOString());
  }

  // Método para verificar status
  getStatus() {
    return {
      isRunning: this.isRunning,
      lastCheck: localStorage.getItem('lastEmailSent_1'),
      nextCheck: this.isRunning ? new Date(Date.now() + this.checkInterval).toISOString() : null
    };
  }
}

export const backgroundWorker = new BackgroundWorker();