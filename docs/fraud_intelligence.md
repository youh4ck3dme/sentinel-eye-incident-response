# Databáza Podvodov a Scams (Fraud Intelligence)

Táto príručka slúži ako referenčný bod pre terminológiu podvodov a bezpečnostných incidentov.

## 1. Základná Terminológia (Terminológia NIST & Industry)

### Phishing (Rybárčenie)
- **Definícia**: Podvodná technika získavania citlivých údajov (heslá, karty) prostredníctvom klamlivých e-mailov alebo webov.
- **Variácie**:
    - **Spear-Phishing**: Cielený útok na konkrétnu osobu/firmu.
    - **Whaling**: Útok na vysoko postavených manažérov (CEO).
    - **Vishing**: Voice Phishing - podvod cez telefón (často s AI/Deepfake).
    - **Smishing**: SMS Phishing - podvod cez SMS správy.
    - **Pharming**: Presmerovanie legitímnej URL na podvodnú stránku.

### Sociálne Inžinierstvo (Social Engineering)
- **Definícia**: Manipulácia ľudí s cieľom prinútiť ich k chybám alebo k vydaniu údajov.
- **Taktyky**:
    - **Urgency (Nátlak)**: "Váš účet bude zajtra zablokovaný!"
    - **Authority (Autorita)**: "Volám z polície / technickej podpory Microsoftu."
    - **Fear (Strach)**: "Vaše dieťa malo nehodu, potrebujeme peniaze na kauciu."
    - **Scarcity (Vzácnosť)**: "Posledná šanca na zhodnotenie kryptomien!"

### BEC (Business Email Compromise)
- Útoky na firemnú komunikáciu s cieľom presmerovať platby na účet útočníka.

### Identity Theft (Krádež Identity)
- Neoprávnené získanie a použitie osobných údajov inej osoby na podvodné účely.

---

## 2. Slovenský Právny a Operačný Kontext

V slovenskom prostredí definujeme:

### Podvod (§ 221 Trestného zákona)
- **Definícia**: Obohatenie seba alebo iného uvedením niekoho do omylu alebo využitím jeho omylu.

### Bežné typy podvodov na Slovensku:
1. **Bazoš/Kuriér podvod**: Útočník predstiera záujem o tovar a posiela link na "získanie platby" od kuriéra (DPD, Packet, Slovenská pošta), ktorý v skutočnosti slúži na odcudzenie údajov z karty.
2. **"Vnúčatko" podvod**: Cielený útok na seniorov (nehoda syna/vnuka).
3. **Kryptomenové podvody**: Prísľuby nereálneho zisku cez falošné investičné platformy.
4. **AnyDesk / TeamViewer podvod**: Falošný technik Microsoftu vyžaduje vzdialený prístup k PC pod zámienkou "odstraňovania vírusu".
5. **Polícia / Zatykač**: Automatizované hovory o "vydaní zatykača" z Europolu/Interpolu.

---

## 3. Odborné Vyrazy pre IR (Incident Response)

- **IOC (Indicator of Compromise)**: Technický indikátor napadnutia (IP adresa, hash súboru, podozrivá doména).
- **TTP (Tactics, Techniques, and Procedures)**: Spôsob, akým útočník operuje.
- **Escalation**: Postup zvýšenia priority incidentu.
- **Eradication**: Úplné odstránenie hrozby zo systému.
- **Containment**: Izolácia hrozby (napr. Jamming, Network Isolation).
