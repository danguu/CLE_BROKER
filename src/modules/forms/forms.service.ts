import prisma from '../../core/prisma';
import { sendMail } from '../../core/mailer';
import env from '../../core/env';
import { contactoSchema, cotizacionSchema } from './forms.schemas';
import { ApiError } from '../../core/errors';

export async function handleContacto(input: unknown, meta: { ip: string; userAgent?: string; referer?: string }) {
  const data = contactoSchema.parse(input);

  const lead = await prisma.lead.create({
    data: {
      nombre: data.nombre,
      email: data.email,
      whatsapp: data.whatsapp,
      destinoInteres: data.destinoInteres,
      origenFormulario: 'contacto',
      ipAddress: meta.ip,
      userAgent: meta.userAgent,
      referer: meta.referer
    }
  });

  await sendMail({
    to: data.email,
    subject: 'Hemos recibido tu solicitud - KayrosGo / Cle_Broker',
    html: `
      <p>Hola ${data.nombre},</p>
      <p>Gracias por contactarnos. Uno de nuestros asesores de KayrosGo / Cle_Broker se comunicará contigo muy pronto.</p>
      <p><strong>Detalles enviados:</strong></p>
      <ul>
        <li>Email: ${data.email}</li>
        <li>WhatsApp: ${data.whatsapp}</li>
        ${data.destinoInteres ? `<li>Destino de interés: ${data.destinoInteres}</li>` : ''}
      </ul>
      <p>¡Estamos listos para ayudarte a planear tu próximo viaje!</p>
    `
  });

  return lead;
}

export async function handleCotizacion(
  input: unknown,
  meta: { ip: string; userAgent?: string; referer?: string }
) {
  const data = cotizacionSchema.parse(input);

  let leadId = data.leadId ?? null;

  if (!leadId) {
    if (!data.nombre || !data.email || !data.whatsapp) {
      throw new ApiError(400, 'Información de lead incompleta');
    }

    const newLead = await prisma.lead.create({
      data: {
        nombre: data.nombre,
        email: data.email,
        whatsapp: data.whatsapp,
        destinoInteres: data.destinoInteres,
        origenFormulario: 'cotizacion',
        ipAddress: meta.ip,
        userAgent: meta.userAgent,
        referer: meta.referer
      }
    });
    leadId = newLead.id;
  }

  const cotizacion = await prisma.cotizacion.create({
    data: {
      leadId,
      programaId: data.programaId,
      mensaje: data.mensaje,
      notas: data.mensaje,
      estado: 'pendiente'
    },
    include: {
      lead: true,
      programa: true
    }
  });

  const lead = cotizacion.lead;
  const programaTitulo = cotizacion.programa?.titulo;

  const resumen = `
    <ul>
      <li>Nombre: ${lead.nombre}</li>
      <li>Email: ${lead.email}</li>
      <li>WhatsApp: ${lead.whatsapp}</li>
      ${lead.destinoInteres ? `<li>Destino de interés: ${lead.destinoInteres}</li>` : ''}
      ${programaTitulo ? `<li>Programa: ${programaTitulo}</li>` : ''}
      ${data.mensaje ? `<li>Mensaje: ${data.mensaje}</li>` : ''}
    </ul>
  `;

  await Promise.all([
    sendMail({
      to: lead.email,
      subject: 'Solicitud de cotización recibida - KayrosGo / Cle_Broker',
      html: `
        <p>Hola ${lead.nombre},</p>
        <p>Hemos recibido tu solicitud de cotización. Nuestro equipo se pondrá en contacto contigo muy pronto.</p>
        <p><strong>Resumen:</strong></p>
        ${resumen}
      `
    }),
    sendMail({
      to: env.ADMIN_EMAIL,
      subject: 'Nueva solicitud de cotización',
      html: `
        <p>Se registró una nueva cotización en KayrosGo / Cle_Broker.</p>
        ${resumen}
      `
    })
  ]);

  return cotizacion;
}
