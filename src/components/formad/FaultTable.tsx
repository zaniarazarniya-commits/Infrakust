type Row = { saw: string; cause: string; fix: string };

const COLUMNS = [
  { key: 'saw', label: 'Vi såg' },
  { key: 'cause', label: 'Orsaken' },
  { key: 'fix', label: 'Lösningen' },
] as const;

const LABEL = 'font-sans text-xs uppercase tracking-section text-accent-gold';

/**
 * FaultTable
 * --------------------------------------------------------------
 * Tre spalter: Vi såg / Orsaken / Lösningen. På telefon staplas
 * cellerna och varje cell får sin spaltetikett ovanför.
 */
export function FaultTable({ rows }: { rows: Row[] }) {
  return (
    <table className="block w-full border-collapse text-left md:table">
      <caption className="sr-only">Felen i kropparna, orsaken och lösningen</caption>
      <thead className="hidden md:table-header-group">
        <tr className="border-b border-text-muted/30">
          {COLUMNS.map((col) => (
            <th key={col.key} scope="col" className={`pb-4 pr-8 font-normal ${LABEL}`}>
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="block divide-y divide-text-muted/10 border-t border-text-muted/30 md:table-row-group md:border-t-0">
        {rows.map((row) => (
          <tr key={row.saw} className="block py-8 md:table-row md:py-0">
            {COLUMNS.map((col) => (
              <td
                key={col.key}
                className={`block align-top md:table-cell md:py-8 md:pr-8 ${
                  col.key === 'saw'
                    ? 'font-serif text-xl leading-snug text-text-primary md:w-[28%]'
                    : 'mt-5 font-sans text-base leading-relaxed text-text-secondary md:mt-0'
                } ${col.key === 'cause' ? 'md:w-[38%]' : ''}`}
              >
                <span className={`mb-2 block md:hidden ${LABEL}`}>{col.label}</span>
                {row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
