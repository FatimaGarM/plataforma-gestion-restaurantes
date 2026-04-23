START TRANSACTION;

DELETE FROM pedido
WHERE estado IN ('Pendiente', 'En proceso', 'Listo');

DELETE FROM servicio
WHERE estado = 0;

UPDATE sesion_mesaS
SET activa = 0
WHERE activa = 1;

COMMIT;
