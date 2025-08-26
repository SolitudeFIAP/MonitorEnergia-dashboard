import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private validCredentials = {
    email: 'testador@monitorenergia.com',
    password: 'teste123'
  };

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    // Interceptar apenas requisições de auth
    if (req.url.endsWith('/auth/login')) {
      return this.handleLogin(req);
    }
    
    if (req.url.endsWith('/auth/register')) {
      return this.handleRegister(req);
    }

    if (req.url.endsWith('/auth/logout')) {
      return this.handleLogout(req);
    }

    if (req.url.endsWith('/auth/request-pass')) {
      return this.handleRequestPassword(req);
    }

    if (req.url.endsWith('/auth/reset-pass')) {
      return this.handleResetPassword(req);
    }

    // Para outras requisições, seguir normalmente
    return next.handle(req);
  }

  private handleLogin(req: HttpRequest<any>): Observable<HttpResponse<any>> {
    const body = req.body;
    const email = body.email;
    const password = body.password;

    if (email === this.validCredentials.email && password === this.validCredentials.password) {
      const response = {
        data: {
          token: 'jwt-token-' + Date.now(),
          user: {
            id: 1,
            email: email,
            name: 'Testador'
          }
        },
        message: 'Login successful'
      };

      return of(new HttpResponse({
        status: 200,
        body: response
      })).pipe(delay(1000));
    } else {
      return throwError({
        status: 401,
        error: {
          message: 'Credenciais inválidas. Use: testador@monitorenergia.com / teste123'
        }
      }).pipe(delay(1000));
    }
  }

  private handleRegister(req: HttpRequest<any>): Observable<HttpResponse<any>> {
    // Desabilitar registro
    return throwError({
      status: 403,
      error: {
        message: 'Registro não permitido'
      }
    }).pipe(delay(1000));
  }

  private handleLogout(req: HttpRequest<any>): Observable<HttpResponse<any>> {
    const response = {
      message: 'Logout successful'
    };

    return of(new HttpResponse({
      status: 200,
      body: response
    })).pipe(delay(500));
  }

  private handleRequestPassword(req: HttpRequest<any>): Observable<HttpResponse<any>> {
    return throwError({
      status: 403,
      error: {
        message: 'Recuperação de senha não disponível'
      }
    }).pipe(delay(1000));
  }

  private handleResetPassword(req: HttpRequest<any>): Observable<HttpResponse<any>> {
    return throwError({
      status: 403,
      error: {
        message: 'Reset de senha não disponível'
      }
    }).pipe(delay(1000));
  }
}
