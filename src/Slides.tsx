import { Btn, Marquee, StatusBadge } from "./ui";
import { FoodIcon, UIIcon } from "./Icon";
import { hours, info, items } from "./menu";
import { fmtHour } from "./lib";

type Status = { open: boolean; until: string; next: string; today: number };

/* ============================== HOME ============================== */

export function HomeSlide({ go, status }: { go: (i: number) => void; status: Status }) {
  return (
    <section className="slide slide-home" id="slide-home" role="tabpanel" aria-label="Home">
      <div className="home-stage">
        <span className="blob blob-a" aria-hidden="true">
          <FoodIcon name="durum" size={96} />
        </span>
        <span className="blob blob-b" aria-hidden="true">
          <FoodIcon name="pita" size={84} />
        </span>
        <span className="blob blob-c" aria-hidden="true">
          <FoodIcon name="fries" size={72} />
        </span>

        <div className="home-copy">
          <p className="eyebrow">◂ Nørrebrogade 98 · Open late ▸</p>
          <h1 className="display">
            <span>Sheik</span>
            <span>Shawarma</span>
            <span className="aside">(Nørrebro)</span>
          </h1>
          <p className="tagline">
            Bread baked fresh every day. Falafel fried in-house. Durum with or without meat — right on
            Nørrebrogade.
          </p>
          <div className="cta-row">
            <Btn variant="primary" onClick={() => go(1)}>
              See menu
            </Btn>
            <Btn variant="ghost" onClick={() => go(3)}>
              <UIIcon name="pin" size={16} /> Find us
            </Btn>
          </div>
          <StatusBadge open={status.open} until={status.until} next={status.next} />
        </div>
      </div>

      <Marquee words={["Shawarma", "Falafel", "Durum", "Pita", "Halloumi", "Nørrebro"]} />
    </section>
  );
}

/* ============================== ABOUT ============================== */

export function AboutSlide({ go }: { go: (i: number) => void }) {
  const cards = [
    { icon: "pita" as const, title: "Bread baked daily", text: "The bread is baked fresh every single day." },
    { icon: "nuggets" as const, title: "Falafel fried in-house", text: "Deep-fried falafel, made by the kitchen itself." },
    { icon: "durum" as const, title: "Fresh, quality meat", text: "Durum comes with or without meat — your call." },
  ];
  return (
    <section className="slide slide-about" id="slide-about" role="tabpanel" aria-label="About">
      <div className="wrap">
        <p className="eyebrow red">◂ Our story ▸</p>
        <h2 className="display-lg">
          Made fresh <span className="aside">(until late)</span>
        </h2>
        <p className="lead">
          Sheik Shawarma sits at Nørrebrogade 98 in the heart of Copenhagen's Nørrebro. Shawarma, falafel and
          halloumi in durum or pita — and the kitchen keeps going long after most of the street has gone to
          bed: until 04:30 on Fridays and Saturdays.
        </p>

        <div className="about-cards">
          {cards.map((c) => (
            <article className="about-card" key={c.title}>
              <FoodIcon name={c.icon} size={56} />
              <h3>{c.title}</h3>
              <p>{c.text}</p>
            </article>
          ))}
        </div>

        <div className="cta-row">
          <Btn variant="primary" onClick={() => go(1)}>
            Browse {items.length} menu items
          </Btn>
          <Btn variant="ghost" onClick={() => go(3)}>
            Opening hours
          </Btn>
        </div>
      </div>
    </section>
  );
}

/* ============================== FIND US ============================== */

export function FindSlide({ status }: { status: Status }) {
  return (
    <section className="slide slide-find" id="slide-find-us" role="tabpanel" aria-label="Find us">
      <div className="wrap find-grid">
        <div className="find-left">
          <p className="eyebrow">◂ Come hungry ▸</p>
          <h2 className="display-lg">
            Find us <span className="aside">(Nørrebro)</span>
          </h2>

          <ul className="contact">
            <li>
              <UIIcon name="pin" size={22} />
              <span>
                {info.street}
                <br />
                {info.city}
              </span>
            </li>
            <li>
              <UIIcon name="phone" size={22} />
              <a href={info.phoneHref}>{info.phone}</a>
            </li>
          </ul>

          <div className="cta-row">
            <Btn variant="primary" href={info.links.maps} external>
              <UIIcon name="pin" size={16} /> Open in Maps
            </Btn>
            <Btn variant="ghost" href={info.links.wolt} external>
              Order on Wolt
            </Btn>
          </div>
          <div className="cta-row">
            <Btn variant="ghost" href={info.links.facebook} external>
              Facebook
            </Btn>
          </div>
        </div>

        <div className="find-right">
          <div className="hours-card">
            <div className="hours-head">
              <h3>Opening hours</h3>
              <StatusBadge open={status.open} until={status.until} next={status.next} />
            </div>
            <table className="hours">
              <tbody>
                {hours.map((h, i) => (
                  <tr key={h.day} className={i === status.today ? "today" : ""}>
                    <th scope="row">{h.day}</th>
                    <td>
                      {fmtHour(h.open)} – {fmtHour(h.close)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="fine">Times are Copenhagen time and may change.</p>
          </div>
        </div>

        <p className="fine foot">
          Prices on the menu are in-store prices in DKK — delivery apps may differ. Concept redesign, built from
          public listings.
        </p>
      </div>
    </section>
  );
}
