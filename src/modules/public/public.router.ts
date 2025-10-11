import { Router } from 'express';
import prisma from '../../core/prisma';

const router = Router();

function safeParseJSON<T>(value?: string): T | undefined {
  if (!value) return undefined;
  try {
    return JSON.parse(value) as T;
  } catch (error) {
    return undefined;
  }
}

router.get('/propuesta', async (_req, res, next) => {
  try {
    const [beneficios, programas, testimonios, servicios, configs] = await Promise.all([
      prisma.beneficio.findMany({ orderBy: { id: 'asc' } }),
      prisma.programaTuristico.findMany({ where: { visible: true }, orderBy: { id: 'asc' }, take: 6 }),
      prisma.testimonio.findMany({ where: { visible: true }, orderBy: { id: 'asc' } }),
      prisma.servicioCleBroker.findMany({ where: { visible: true }, orderBy: [{ orden: 'asc' }, { id: 'asc' }] }),
      prisma.config.findMany({ where: { clave: { in: ['membresiaCodigo', 'propuestaProceso'] } } })
    ]);

    const configMap = Object.fromEntries(configs.map((item) => [item.clave, item.valorJSON]));

    const proceso =
      safeParseJSON<{ titulo: string; descripcion: string }[]>(configMap.propuestaProceso) ?? [
        { titulo: 'Paso 1', descripcion: 'Elige tu programa' },
        { titulo: 'Paso 2', descripcion: 'Recibe una cotización oficial con respaldo' },
        { titulo: 'Paso 3', descripcion: 'Viaja con tranquilidad' }
      ];

    const membresiaCodigo = safeParseJSON<string>(configMap.membresiaCodigo) ?? 'R9025';

    const propuesta = {
      beneficios,
      programasDestacados: programas,
      testimonios,
      serviciosCleBroker: servicios,
      proceso,
      mensajesClave: {
        accesoPreciosPreferenciales: 'Acceso a precios preferenciales',
        asesoriaPersonalizada: 'Asesoría personalizada',
        respaldoOficial: 'Respaldo oficial'
      },
      membresiaCodigo
    };

    res.json(propuesta);
  } catch (error) {
    next(error);
  }
});

export default router;
