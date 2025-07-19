import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="footer">
      <div class="footer-content">
        <span class="footer-brand">
          <span class="material-icons">directions_car</span>
          RentaFácil
        </span>
        <span class="footer-copy">&copy; {{ year }} RentaFácil. Todos los derechos reservados.</span>
        <span class="footer-contact">Contacto: soporte@rentafacil.com</span>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      width: 100%;
      background: #222;
      color: #fff;
      padding: 16px 0;
      position: fixed;
      left: 0;
      bottom: 0;
      z-index: 99;
      box-shadow: 0 -2px 8px rgba(0,0,0,0.07);
    }
    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      font-family: 'Montserrat', sans-serif;
      font-size: 1rem;
    }
    .footer-brand {
      display: flex;
      align-items: center;
      font-weight: 700;
      font-size: 1.2rem;
    }
    .footer-brand .material-icons {
      margin-right: 6px;
      font-size: 1.4rem;
      color: #1976d2;
    }
    .footer-copy {
      font-size: 0.95rem;
      opacity: 0.8;
    }
    .footer-contact {
      font-size: 0.95rem;
      opacity: 0.8;
    }
    @media (max-width: 600px) {
      .footer-content { flex-direction: column; gap: 6px; text-align: center; }
    }
  `]
})
export class FooterComponent {
  year = new Date().getFullYear();
} 