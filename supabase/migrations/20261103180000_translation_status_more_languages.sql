-- Bereits auf MehrDrin-Datenbank angewendet (03.11.2026). Hier zur Dokumentation.
-- Übersicht der Übersetzungen um Türkisch, Arabisch und Ukrainisch erweitert.
create or replace view public.funding_translation_status
with (security_invoker = true) as
select f.id as funding_id, l.lang,
  case when t.funding_id is null then 'missing'
       when t.source_hash <> public.funding_source_hash(f) then 'outdated'
       else t.status end as state
from public.funding f
cross join (values ('en'), ('tr'), ('ar'), ('uk')) as l(lang)
left join public.funding_translations t on t.funding_id = f.id and t.lang = l.lang;
revoke all on public.funding_translation_status from anon, authenticated;
