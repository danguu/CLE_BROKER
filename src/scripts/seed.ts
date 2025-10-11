import bcrypt from 'bcryptjs';
import prisma from '../core/prisma';
import env from '../core/env';
import logger from '../core/logger';

async function seedAdmin() {
  const hash = await bcrypt.hash(env.ADMIN_PASSWORD, 10);
  await prisma.adminUser.upsert({
    where: { email: env.ADMIN_EMAIL },
    update: { hash },
    create: { email: env.ADMIN_EMAIL, hash, role: 'ADMIN' }
  });
  logger.info('Usuario admin preparado');
}

async function seedBeneficios() {
  const count = await prisma.beneficio.count();
  if (count === 0) {
    await prisma.beneficio.createMany({
      data: [
        { titulo: 'Acceso a paquetes exclusivos de socios de membresía', detalle: 'Reservas preferenciales con aliados estratégicos.' },
        { titulo: 'Precios especiales', detalle: 'Tarifas negociadas para optimizar tu presupuesto de viaje.' },
        { titulo: 'Flexibilidad en fechas y destinos', detalle: 'Adaptamos la experiencia a tus necesidades.' },
        { titulo: 'Asesoría personalizada', detalle: 'Acompañamiento experto en cada etapa del viaje.' },
        { titulo: 'Respaldo oficial', detalle: 'Soporte con garantía KayrosGo / Cle_Broker.' }
      ]
    });
    logger.info('Beneficios base insertados');
  }
}

async function seedProgramas() {
  const count = await prisma.programaTuristico.count();
  if (count === 0) {
    await prisma.programaTuristico.createMany({
      data: [
        {
          titulo: 'Cancún All Inclusive – 4 noches',
          descripcion: 'Disfruta de Cancún en hotel 5 estrellas con plan todo incluido y traslados.',
          dias: 5,
          noches: 4,
          allInclusive: true,
          destino: 'Cancún, México',
          rating: 4.8,
          visible: true
        },
        {
          titulo: 'Europa Express – 7 días',
          descripcion: 'Recorre España, Francia e Italia en un itinerario dinámico y lleno de cultura.',
          dias: 7,
          noches: 6,
          allInclusive: false,
          destino: 'Europa',
          rating: 4.6,
          visible: true
        },
        {
          titulo: 'Caribe Familiar – 5 noches',
          descripcion: 'Paquete pensado para familias con actividades y resorts todo incluido.',
          dias: 6,
          noches: 5,
          allInclusive: true,
          destino: 'Caribe',
          rating: 4.7,
          visible: true
        }
      ]
    });
    logger.info('Programas turísticos base insertados');
  }
}

async function seedTestimonios() {
  const count = await prisma.testimonio.count();
  if (count === 0) {
    await prisma.testimonio.createMany({
      data: [
        {
          autor: 'Mariana G.',
          contenido: 'KayrosGo nos ayudó a coordinar un viaje inolvidable al Caribe con toda mi familia. Excelente atención.',
          fuente: 'Google Reviews',
          visible: true
        },
        {
          autor: 'Luis P.',
          contenido: 'Gracias a Cle_Broker obtuvimos tarifas corporativas muy competitivas para nuestro equipo.',
          visible: true
        },
        {
          autor: 'Andrea R.',
          contenido: 'La asesoría personalizada hizo la diferencia, encontramos el programa ideal para celebrar nuestro aniversario.',
          visible: true
        }
      ]
    });
    logger.info('Testimonios base insertados');
  }
}

async function seedServicios() {
  const count = await prisma.servicioCleBroker.count();
  if (count === 0) {
    await prisma.servicioCleBroker.createMany({
      data: [
        {
          titulo: 'Hoteles a precios cómodos',
          descripcionCorta: 'Negociamos tarifas preferenciales en hoteles reconocidos.',
          descripcionLarga: 'Tarifas dinámicas con disponibilidad confirmada y upgrades sujetos a disponibilidad.',
          orden: 1,
          visible: true
        },
        {
          titulo: 'Alquiler de autos',
          descripcionCorta: 'Cobertura internacional con aliados de confianza.',
          descripcionLarga: 'Reservas inmediatas, seguros incluidos y opciones flexibles por día o semana.',
          orden: 2,
          visible: true
        },
        {
          titulo: 'Cruceros',
          descripcionCorta: 'Itinerarios por el Caribe, Mediterráneo y Alaska.',
          descripcionLarga: 'Experiencias premium con planes familiares y de lujo.',
          orden: 3,
          visible: true
        },
        {
          titulo: 'Planes 5d/4n',
          descripcionCorta: 'Programas diseñados para escapadas completas.',
          descripcionLarga: 'Incluye vuelos, hotel y asistencia personalizada en destino.',
          orden: 4,
          visible: true
        },
        {
          titulo: 'Hoteles con alimentación',
          descripcionCorta: 'Desayuno, media pensión o todo incluido según tus preferencias.',
          orden: 5,
          visible: true
        }
      ]
    });
    logger.info('Servicios Cle_Broker base insertados');
  }
}

async function seedConfig() {
  await prisma.config.upsert({
    where: { clave: 'membresiaCodigo' },
    update: { valorJSON: JSON.stringify('R9025') },
    create: { clave: 'membresiaCodigo', valorJSON: JSON.stringify('R9025') }
  });

  await prisma.config.upsert({
    where: { clave: 'propuestaProceso' },
    update: {
      valorJSON: JSON.stringify([
        { titulo: 'Paso 1', descripcion: 'Elige tu programa favorito' },
        { titulo: 'Paso 2', descripcion: 'Recibe una cotización oficial con respaldo' },
        { titulo: 'Paso 3', descripcion: 'Viaja con tranquilidad y soporte permanente' }
      ])
    },
    create: {
      clave: 'propuestaProceso',
      valorJSON: JSON.stringify([
        { titulo: 'Paso 1', descripcion: 'Elige tu programa favorito' },
        { titulo: 'Paso 2', descripcion: 'Recibe una cotización oficial con respaldo' },
        { titulo: 'Paso 3', descripcion: 'Viaja con tranquilidad y soporte permanente' }
      ])
    }
  });

  logger.info('Configuraciones base actualizadas');
}

async function main() {
  await seedAdmin();
  await seedBeneficios();
  await seedProgramas();
  await seedTestimonios();
  await seedServicios();
  await seedConfig();
}

main()
  .catch((error) => {
    logger.error({ error }, 'Error durante la semilla');
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
