# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - img "logo" [ref=e6] [cursor=pointer]
    - generic [ref=e7]:
      - link "Cadastro" [ref=e8] [cursor=pointer]:
        - /url: /register
      - link "Login" [ref=e9] [cursor=pointer]:
        - /url: /login
      - link "Carrinho" [ref=e10] [cursor=pointer]:
        - /url: /cart
      - link "Admin" [ref=e11] [cursor=pointer]:
        - /url: /admin
  - main [ref=e12]:
    - generic [ref=e13]:
      - img "Logo InfoWord" [ref=e14]
      - heading "Cadastre-se" [level=1] [ref=e15]
      - generic [ref=e16]:
        - textbox "Digite seu nome" [ref=e17]: Ana Paula
        - textbox "Digite seu e-mail" [ref=e18]: anapaula@test.com
        - textbox "Digite sua senha" [ref=e19]: "123456"
        - button "Cadastrar" [active] [ref=e20] [cursor=pointer]
      - paragraph [ref=e21]: Erro ao cadastrar. Tente novamente.
  - contentinfo [ref=e22]:
    - generic [ref=e24]:
      - heading "Redes Sociais" [level=4] [ref=e25]
      - generic [ref=e26]:
        - img [ref=e28]
        - img [ref=e31]
        - img [ref=e34]
    - paragraph [ref=e37]: © 2025 InfoWord. Todos os direitos reservados.
```