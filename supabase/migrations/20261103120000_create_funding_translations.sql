-- Bereits auf MehrDrin-Datenbank angewendet (03.11.2026). Hier zur Dokumentation.

-- Übersetzungen der Fördereinträge. Eine Zeile je Eintrag und Sprache.
-- Nur Texte werden übersetzt; Tags, Alter, Bezirke usw. bleiben einmalig in public.funding.
create table public.funding_translations (
  funding_id uuid not null references public.funding(id) on delete cascade,
  lang text not null check (lang ~ '^[a-z]{2,3}(-[a-z0-9]+)?$' and lang <> 'de'),
  title text not null,
  description text not null,
  amount text,
  application_process text,
  -- md5 der deutschen Ausgangstexte zum Zeitpunkt der Übersetzung.
  -- Weicht er vom aktuellen Hash ab, ist die Übersetzung veraltet.
  source_hash text not null,
  -- 'machine' = maschinell, 'reviewed' = von Muttersprachler:in geprüft
  status text not null default 'machine' check (status in ('machine', 'reviewed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (funding_id, lang)
);

create index funding_translations_lang_idx on public.funding_translations (lang);

alter table public.funding_translations enable row level security;
create policy "Allow public read access" on public.funding_translations
  for select using (true);

-- Gleiche Hash-Formel wie scripts/translate.ts
create or replace function public.funding_source_hash(f public.funding)
returns text language sql immutable set search_path = '' as $$
  select md5(coalesce(f.title,'') || chr(31) || coalesce(f.description,'') || chr(31) ||
             coalesce(f.amount,'') || chr(31) || coalesce(f.application_process,''))
$$;

-- Übersicht: welche Übersetzungen fehlen oder sind veraltet (nur im Dashboard sichtbar)
create or replace view public.funding_translation_status
with (security_invoker = true) as
select f.id as funding_id, l.lang,
  case when t.funding_id is null then 'missing'
       when t.source_hash <> public.funding_source_hash(f) then 'outdated'
       else t.status end as state
from public.funding f
cross join (values ('en')) as l(lang)
left join public.funding_translations t on t.funding_id = f.id and t.lang = l.lang;

revoke all on public.funding_translation_status from anon, authenticated;
