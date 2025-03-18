import { Elysia } from "elysia";
import type { ElysiaWS } from "elysia/dist/ws";
import logixlysia from "logixlysia";

type _CallData = {
  nama?: string;
  id_pasien?: number;
  id_registrasi_detail_layanan?: number;
  id_ruangan?: number;
  id_dokter?: number;
  no_registrasi?: string;
  tanggal_masuk?: string;
  noantrian?: string;
  noantriandokter?: string;
  nama_ruangan?: string;
  dokter?: string;
  created_by?: string;
};

type _Call = {
  cdfix?: number;
  data?: _CallData;
};

const port: number = 3000;
const clients = new Map<string, Set<ElysiaWS>>();
const app = new Elysia()
  .use(
    logixlysia({
      config: {
        showStartupMessage: true,
        startupMessageFormat: "banner",
        timestamp: {
          translateTime: "yyyy-mm-dd HH:MM:ss",
        },
        ip: true,
        logFilePath: "./logs/runtime.log",
        customLogFormat:
          "{now} {level} {duration} {method} {pathname} {status} {message} {ip} {epoch}",
      },
    })
  )
  .get("/", () => "Hello Elysia")
  .group("/socket", (socket) =>
    socket
      .ws("/call", {
        message: (_, message) => {
          const { cdfix, data } = message as _Call;

          if (cdfix) {
            for (const client of clients.get(String(cdfix)) ?? []) {
              client.send(data);
            }
          }
        },
      })
      .ws("/viewer/display/:cdfix", {
        open: (ws) => {
          const { cdfix } = ws.data.params;

          if (!clients.has(cdfix)) {
            clients.set(cdfix, new Set());
          }

          clients.get(cdfix)?.add(ws);
        },
        close: (ws) => {
          const { cdfix } = ws.data.params;

          clients.get(cdfix)?.delete(ws);

          if (clients.get(cdfix)?.size === 0) {
            clients.delete(cdfix);
          }
        },
      })
  )
  .listen(port);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
