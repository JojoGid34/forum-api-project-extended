# Forum API V2 (Backend Expert Submission)

![CI Status](https://github.com/JojoGid34/forum-api-project-extended/actions/workflows/ci.yml/badge.svg)
![Deployment Status](https://img.shields.io/badge/deployment-railway-success)

Proyek ini adalah submission untuk kelas Menjadi Backend Developer Expert (Dicoding).

## 🔗 Deployment & CD
Aplikasi ini menerapkan **Continuous Deployment** menggunakan **Railway** (Auto Deploy dari branch main).

- **App URL:** [https://forum-api-project-extended-production.up.railway.app](https://forum-api-project-extended-production.up.railway.app)
- **HTTPS:** Otomatis aktif via Railway.
- **Limit Access:** File konfigurasi `nginx.conf` (Rate Limit 90req/m) dilampirkan di root repository sesuai instruksi. Limit Access juga diimplementasikan di level aplikasi menggunakan plugin `hapi-rate-limit`.

## 🛠️ Tech Stack
- **Framework:** Hapi.js
- **Database:** PostgreSQL (`node-pg-migrate`)
- **Testing:** Jest (Unit, Integration, Functional)
- **CI/CD:** GitHub Actions & Railway

## 🏃‍♂️ Cara Menjalankan (Lokal)

1.  **Clone & Install:**
    ```bash
    git clone [https://github.com/JojoGid34/forum-api-project-extended.git](https://github.com/JojoGid34/forum-api-project-extended.git)
    npm install
    ```

2.  **Setup Database:**
    Buat file `.env` sesuai konfigurasi lokal, lalu jalankan:
    ```bash
    npm run migrate up
    ```

3.  **Jalankan Server:**
    ```bash
    npm run start
    ```

4.  **Jalankan Test:**
    ```bash
    npm test
    ```