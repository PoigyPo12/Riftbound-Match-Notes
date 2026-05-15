# RB Match Buddy
### Overview and Online Access

**Riftbound Match Buddy** is a real-time synchronization tool designed to bridge the communication gap between Table Judges and Backstage Staff (Head Judges, Backstage Judges or Coverage Teams). It provides a shared digital state for resource tracking and rules enforcement, optimized for Feature Match environments.

It can be **accessed** through https://poigypo12.github.io/riftbound-match-notes/

---

## 1. Operational Roles & Control Logic

The system uses a simple **Room Code** architecture to connect devices via Firebase with two distinct permission levels:

* **Judge (Admin)**: The official at the table. Has full authority to modify stats, manage the timer, and log penalties.
* **Viewer (Backstage)**: Provides a real-time, mainly read-only mirror of the match, with limited, focused interaction (e.g.: *Stat Flagging* & *Judge Call*; also see [§2.Judge Call & Ownership](#judge-call-and-ownership))
    * **Stat Flagging**: Viewers can tap any resource container to "flag" it (turning it red on the Judge's screen). This allows backstage judges to discreetly signal a potential error (such as a missed draw or incorrect rune count) without verbal interruption.

---

## 2. Main features

### The "My Turn" Logic 
To ensure the log and resources are accurate, the Judge must trigger the **"My Turn"** button for the player starting their turn (*also for the first turn of each game*). This action performs several automated tasks:
* **Resource Reset**: Clears the current *Energy* and *Power* for both players; they are indicators for resources stored in the *Rune Pool*.
* **Rune Channeling**: Automatically adds **2 Runes** to the active player (capped at 12).
* **Turn Counter**: Increments the turn count for the active player.
* **Global Sync**: Updates the turn status for all Viewers and logs the event with a timestamp.

### Scoring Dynamics
The **Points** container has specific shortcuts:
* **Standard (+/-)**: For generic adjustment.
* **Conquer (+C)**: Specifically for points gained through *Conquer*.
* **Hold (+H)**: Specifically for points gained through *Hold*.
* *Note: Scoring types are explicitly labeled in the match history log for post-match audit.*

### Judge Call and Ownership 
The **Judge Call** is a global alert system that triggers a pulsing red overlay on all connected devices.
* **Closing Ownership**: To maintain a clear chain of command, **the call must be closed by the same role that opened it**. If a Viewer opens a call, they are the only ones who can dismiss the red glow, signaling that the backstage concern has been resolved (also see ["Undo engine" in §6](#6-other-notes-and-license)).

### Logs
Every interaction — from a single point change to a "Judge Call" — is recorded in a **Match History**.
* Both the Judge and Viewers share the same, synchronized log list.
* **Post-Match Report**: The entire log can be exported as a `.txt` file (via the Match History menu or before resetting the game stats via the Settings menu) or copied to clipboard (via the Match History menu only), providing a second-by-second account of the match for late-round discussions or coverage recaps.

### Additional Resources
   * A simple additional tool ("**Auditor Tool**") is linked in the Settings menu: its purpose is to speed up the calculations you do to reconstruct a previous game state or verify the correctness of the current one (this is simple backtracking that is done mentally in most cases, but in a context of high pressure or accumulated fatigue it can be a viable option, even with the intent of just double-checking).
   * A link to **Ruinrunner Compendium** is available through the Settings menu: it offers hyperlinked Tournament Rules, Core Rules, a database of card texts, rulings and FAQs.

### Editability of Table number and Judge Name
* If you made a mistake in inputting one of the above parameters and you're already in the Room, where you see all the stats, you can change:
   * the **Judge name** through the Settings Menu (simply change the name displayed in the dedicated box and tap on "Save");
   * the **Table number** by tapping on the orange container ("TBL") right next to the Room Code; edit the number and tap away or tap enter.
---

## 3. Infractions and Penalties 

The tool includes a simple **Penalty Manager** (shield button near to the player name) aligned with official standards (GamePlay Errors - GPE, Tournament Errors - TE, Unsporting Conduct - UC). Unlike match stats, **resetting the game does NOT clear Infractions**.
This ensures that even if a match is reset for a new Game 2 or 3, the Judge maintains a persistent record of Warnings or Game Losses assigned during the entire match session. It can be useful if the Viewer is the one in charge of updating info for that match in PurpleFox.
* **Subtype Database**: Includes pre-configured subtypes like *Missed Trigger, Decklist Error, Slowplay, etc.*
* **Infraction icons**: Each infraction class (GPE, TE, UC) has a an *icon each with a different shape* assigned; when a new penalty is issued to a player, one unit of the corresponding shape will appear in the line of that player's name. They stack horizontally.

---

## 4. Time Management and "Safety"

### Extra Time
* **Supplementary Tracking**: This timer tracks ruling time or technical pauses.
* This value is **independent**. It should be treated as a "delta" to be added to the official extra time already recorded in primary tournament software (like PurpleFox).

### Navigation Guard
To prevent accidental data loss, the tool implements a **History API interceptor**. Standard mobile navigation (back-swipes or hardware back buttons) is blocked and redirected to a custom confirmation modal, protecting the active session.

---

## 5. Network resilience

* **Persistent Data State**: The application handles temporary internet disconnections. All match data is queued in the device's local memory; once the connection is restored, the system automatically synchronizes pending updates with the server.
* **Live Status indicator**: A small status LED next to the Judge's name provides visual feedback on connectivity:
    * 🟢 **Green**: Connected and synchronized with the server.
    * 🔴 **Red**: Offline or unstable connection. Changes made while red will be queued and pushed once the indicator returns to green.
      
---

## 6. Other Notes and License

* **Undo Engine**: A 30-step deep undo stack allows the Judge to revert any accidental input instantly.
   * The Undo engine also reverts global flags and ownership markers. *If a Viewer triggers an accidental Judge Call*, the Judge (admin) can use Undo to revert the match to a "pre-call" state, effectively erasing the accidental alert and its corresponding log entry.
* **Wake Lock**: By toggling the dedicated option in the settings menu, it's possible to prevent mobile screens from dimming.
* **Colorblind Mode**: *Currently WiP*; in the Settings menu a dedicated toggle will switch the colors of some elements to a more colorblind-friendly palette.
* **License**: **Free to Use**. Provided as a community resource. You are free to host, use, and modify this tool for any local or major competitive event.

---

**Author**: Atled  
