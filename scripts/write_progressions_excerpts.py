"""Write progressions-excerpt.md files for the 44 standards needing them.

Each file gets:
  1. Source citation header (PDF, page range, section)
  2. Verbatim quote from the Progressions
  3. Bulleted extraction (what kid does, misconceptions, where in progression, representations)
  4. Cross-references

All content drawn verbatim from the compiled Progressions K-5 PDF
(Common Core Standards Writing Team, 2023). No fabrication: if the
Progressions doesn't name a misconception, we say so explicitly.
"""
import os

ROOT = r"C:/projects/math-games-builder/docs/mapping-kits"

# ---- shared excerpts -------------------------------------------------------

# CC overview & K section spans PDF pages 16-18.
CC_OVERVIEW_QUOTE = """> The domain of Counting and Cardinality is about understanding and using numbers. Counting and Cardinality underlies Operations and Algebraic Thinking as well as Number and Operations in Base Ten. It begins with early counting and telling how many in one group of objects. Addition, subtraction, multiplication, and division grow from these early roots. From its very beginnings, this progression involves important ideas that are neither trivial nor obvious; these ideas need to be taught, in ways that are interesting and engaging to young students."""

# ---- excerpt data: one dict per standard -----------------------------------

EXCERPTS = {}

# ============================================================================
# K.CC.A — Know number names and the count sequence
# ============================================================================

EXCERPTS["K.CC.A.1"] = dict(
    citation="**Source:** *Progressions for the Common Core State Standards for Mathematics* (Common Core Standards Writing Team, 2023), **K–5 Counting and Cardinality, §Kindergarten**, PDF pages 16–17 (printed pages 10–11).",
    verbatim="""> Several progressions originate in knowing number names and the count sequence. K.CC.1 Count to 100 by ones and by tens.
>
> **From saying the counting words to counting out objects.** Students usually know or can learn to say the counting words up to a given number before they can use these numbers to count objects or to tell the number of objects. Students become fluent in saying the count sequence so that they have enough attention to focus on the pairings involved in counting objects. To count a group of objects, they pair each word said with one object. K.CC.4a This is usually facilitated by an indicating act (such as pointing to objects or moving them) that keeps each word said in time paired to one and only one object located in space.""",
    cc_ref="K-5 NBT Progression p. 55: \"Children do count by tens in Kindergarten K.CC.1 to develop their understanding of and fluency with the pattern of decade words so that they can build all two-digit counting words.\"",
    can_do=[
        "Recite the count sequence from 1 to 100 by ones.",
        "Recite the count sequence by tens (10, 20, 30, ... 100).",
        "Say the counting words fluently enough that attention is freed up for one-to-one pairing with objects later.",
    ],
    misconceptions=[
        "English number words from 11–19 do not make their base-ten meanings evident: \"eleven\" and \"twelve\" do not sound like \"ten and one\" / \"ten and two\"; \"thirteen\" through \"nineteen\" reverse the order of ones and tens; \"teen\" must be interpreted as \"ten\"; \"thir\" and \"fif\" do not clearly say \"three\" and \"five.\"",
        "Children frequently make count errors crossing decades, such as \"twenty-nine, twenty-ten, twenty-eleven, twenty-twelve.\" (See K-5 NBT Progression p. 56.)",
    ],
    progression=[
        "Earlier: at-home or preschool exposure to counting words (no formal predecessor in the Standards).",
        "Later: K.CC.2 (counting forward from a given number), K.CC.4 (one-to-one pairing of words with objects), and K.NBT.1 (recognizing teen numbers as ten ones and some more ones).",
    ],
    representations=[
        "Spoken count sequence (oral practice).",
        "Counting by tens to develop the decade-word pattern (10, 20, 30 ... 90) so students can later build all two-digit counting words. (NBT Progression p. 55)",
    ],
)

EXCERPTS["K.CC.A.2"] = dict(
    citation="**Source:** Progressions K–5 CC, §Kindergarten, PDF page 17 (printed page 11).",
    verbatim="""> Being able to count forward, beginning from a given number within the known sequence, K.CC.2 is a prerequisite for such counting on.
>
> *(Context: this sentence appears within the discussion of \"From counting to counting on,\" where the Progressions explains that counting on is a Grade 1 advance built on K.CC.2.)*""",
    cc_ref="K.CC.2 is named explicitly as the prerequisite for the Level 2 \"counting on\" strategy that becomes central in Grade 1 (1.OA.6).",
    can_do=[
        "Count forward starting from any number within the known sequence — not just from 1.",
    ],
    misconceptions=[
        "Not explicitly named in the Progressions for K.CC.2 specifically. The Progressions notes (p. 17) that prior to mastering this, \"a student might have to recount entirely a collection of known cardinality to which a single object has been added.\"",
    ],
    progression=[
        "Earlier: K.CC.1 (knowing the count sequence by ones).",
        "Later: Level 2 \"counting on\" strategy for addition and subtraction (1.OA.6); also 1.NBT.1 extending the count sequence to 120.",
    ],
    representations=[
        "Verbal counting starting from a given number (no specific visual representation called out by the Progressions for K.CC.2).",
    ],
)

EXCERPTS["K.CC.A.3"] = dict(
    citation="**Source:** Progressions K–5 CC, §Kindergarten, sidebar on PDF page 17 and Progressions K–5 NBT, §Kindergarten, PDF page 61.",
    verbatim="""> K.CC.3 Write numbers from 0 to 20. Represent a number of objects with a written numeral 0–20 (with 0 representing a count of no objects).
>
> The 0 in 10 uses the understanding of \"0 as a count of no objects,\" K.CC.3 but also is the first use of 0 as a placeholder when a digit in a place means 0 units, here 0 ones. In Kindergarten, children mostly use the meaning of 10 as a counting number after 9 and before 11, but also gain foundational knowledge about 0 as placeholder, an understanding that will be extended in Grade 1.""",
    cc_ref="K.NBT.1 (writing teen numbers in base-ten form); Grade 1 extension of 0 as placeholder.",
    can_do=[
        "Write the numerals 0 through 20.",
        "Match a written numeral 0–20 to a group of that many objects.",
        "Recognize that 0 stands for a count of no objects.",
    ],
    misconceptions=[
        "Not explicitly named for K.CC.3 in the Progressions. The Progressions does note (NBT p. 55) that \"initially, a numeral such as 16 looks like 'one, six,' not '1 ten and 6 ones'\" — relevant for the 11–20 range students are writing.",
    ],
    progression=[
        "Earlier: K.CC.1 (oral count sequence) and K.CC.4 (cardinality).",
        "Later: K.NBT.1 (recording teen-number decompositions as equations like 18 = 10 + 8); 1.NBT.1 extends written representation to 120.",
    ],
    representations=[
        "Written numerals paired with object groups.",
        "Layered place value cards introduced later (NBT p. 55) help children see that the 0 in 10 is a placeholder.",
    ],
)

# ---- K.CC.B — Count to tell the number of objects --------------------------

EXCERPTS["K.CC.B.4"] = dict(
    citation="**Source:** Progressions K–5 CC, §Kindergarten, PDF pages 16–17 (printed pages 10–11). K.CC.4 is the umbrella standard discussed across both pages.",
    verbatim="""> K.CC.4 Understand the relationship between numbers and quantities; connect counting to cardinality.
>
> [Discussion of K.CC.4a:] To count a group of objects, they pair each word said with one object. This is usually facilitated by an indicating act (such as pointing to objects or moving them) that keeps each word said in time paired to one and only one object located in space. Counting objects arranged in a line is easiest; with more practice, students learn to count objects in more difficult arrangements, such as rectangular arrays (they need to ensure they reach every row or column and do not repeat rows or columns); circles (they need to stop just before the object they started with); and scattered configurations (they need to make a single path through all of the objects).
>
> [Discussion of K.CC.4b:] Students understand that the last number name said in counting tells the number of objects counted. Prior to reaching this understanding, a student who is asked \"How many kittens?\" may regard the counting performance itself as the answer, instead of answering with the cardinality of the set.
>
> [Discussion of K.CC.4c:] Finally, understanding that each successive number name refers to a quantity that is one larger is the conceptual start for Grade 1 counting on. Prior to reaching this understanding, a student might have to recount entirely a collection of known cardinality to which a single object has been added.""",
    cc_ref="K.CC.5, K.OA.1, 1.OA.6 (counting on).",
    can_do=[
        "Pair each spoken number word with exactly one object (one-to-one correspondence).",
        "Recognize that the last number said names the total count (cardinality).",
        "Understand that adding one more object means the next number in the count.",
    ],
    misconceptions=[
        "Children may treat \"the counting performance itself\" as the answer to \"how many?\" rather than reporting the final cardinality.",
        "Until K.CC.4c is mastered, a child must recount the whole collection rather than just say the next number when one more is added.",
    ],
    progression=[
        "Earlier: K.CC.1, K.CC.2 (the count sequence itself).",
        "Later: K.CC.5 (count out a given number of objects); K.OA.1 (representing addition/subtraction); 1.OA.6 (Level 2 counting on).",
    ],
    representations=[
        "Objects arranged in a line (easiest), then rectangular arrays, circles, and scattered configurations.",
        "Pointing or moving objects (the \"indicating act\") to keep words paired with objects.",
        "Fingers used to show small numbers; the Progressions notes (p. 17) that students should \"develop rapid visual and kinesthetic recognition of numbers to 5 on their fingers.\"",
    ],
)

EXCERPTS["K.CC.B.4a"] = dict(
    citation="**Source:** Progressions K–5 CC, §Kindergarten, PDF page 16 (printed page 10).",
    verbatim="""> K.CC.4a When counting objects, say the number names in the standard order, pairing each object with one and only one number name and each number name with one and only one object.
>
> To count a group of objects, they pair each word said with one object. K.CC.4a This is usually facilitated by an indicating act (such as pointing to objects or moving them) that keeps each word said in time paired to one and only one object located in space. Counting objects arranged in a line is easiest; with more practice, students learn to count objects in more difficult arrangements, such as rectangular arrays (they need to ensure they reach every row or column and do not repeat rows or columns); circles (they need to stop just before the object they started with); and scattered configurations (they need to make a single path through all of the objects).""",
    cc_ref="K.CC.4b, K.CC.4c, K.CC.5.",
    can_do=[
        "Use one-to-one correspondence: each object gets exactly one number word, each number word goes with exactly one object.",
        "Say the counting words in the standard order while pairing.",
    ],
    misconceptions=[
        "Skipping or double-counting objects in difficult arrangements: rectangular arrays (missing or repeating rows/columns), circles (forgetting to stop at the start), scattered configurations (no clear path).",
    ],
    progression=[
        "Earlier: K.CC.1 (the count sequence).",
        "Later: K.CC.4b (cardinality), K.CC.5 (count to answer \"how many?\").",
    ],
    representations=[
        "Objects in a line (easiest first).",
        "Rectangular arrays, circles, scattered configurations (later, harder).",
        "Pointing or physically moving each object as it is counted.",
    ],
)

EXCERPTS["K.CC.B.4b"] = dict(
    citation="**Source:** Progressions K–5 CC, §Kindergarten, PDF page 17 (printed page 11).",
    verbatim="""> K.CC.4b Understand that the last number name said tells the number of objects counted. The number of objects is the same regardless of their arrangement or the order in which they were counted.
>
> Students understand that the last number name said in counting tells the number of objects counted. K.CC.4b Prior to reaching this understanding, a student who is asked \"How many kittens?\" may regard the counting performance itself as the answer, instead of answering with the cardinality of the set. Experience with counting allows students to discuss and come to understand the second part of K.CC.4b — that the number of objects is the same regardless of their arrangement or the order in which they were counted.""",
    cc_ref="K.CC.4a (one-to-one pairing), K.CC.4c (one larger), K.CC.5.",
    can_do=[
        "Answer \"how many?\" with the last number said in the count (cardinal principle).",
        "Recognize the count is the same regardless of arrangement or counting order (order irrelevance).",
    ],
    misconceptions=[
        "Treating the counting performance itself as the answer: a child asked \"How many kittens?\" recites \"1, 2, 3, 4\" instead of answering \"4.\"",
        "Believing rearranging the objects changes the count.",
    ],
    progression=[
        "Earlier: K.CC.4a (one-to-one pairing).",
        "Later: K.CC.5 (count out a given number); K.CC.4c (one-more); foundation for K.OA.1 and all later arithmetic.",
    ],
    representations=[
        "Same group of objects counted from different starting points / in different arrangements.",
    ],
)

EXCERPTS["K.CC.B.4c"] = dict(
    citation="**Source:** Progressions K–5 CC, §Kindergarten, PDF page 17 (printed page 11).",
    verbatim="""> K.CC.4c Understand that each successive number name refers to a quantity that is one larger.
>
> Finally, understanding that each successive number name refers to a quantity that is one larger K.CC.4c is the conceptual start for Grade 1 counting on. Prior to reaching this understanding, a student might have to recount entirely a collection of known cardinality to which a single object has been added.
>
> [And, from p. 20:] Patterns such as \"adding one is just the next counting word\" K.CC.4c and \"adding zero gives the same number\" become more visible and useful for all of the numbers from 1 to 9.""",
    cc_ref="1.OA.6 (counting on); K.OA.5 (fluent add/subtract within 5).",
    can_do=[
        "Recognize that the next number in the count is exactly one more in quantity.",
        "When one object is added to a known set, name the new total without recounting from 1.",
    ],
    misconceptions=[
        "Having to recount the entire collection from 1 after adding a single object.",
    ],
    progression=[
        "Earlier: K.CC.4a, K.CC.4b.",
        "Later: 1.OA.6 \"counting on\" Level 2 method; conceptual basis for the +1 pattern in single-digit arithmetic.",
    ],
    representations=[
        "Sets of objects with one more added; verbal counting to reveal the +1 pattern.",
    ],
)

EXCERPTS["K.CC.B.5"] = dict(
    citation="**Source:** Progressions K–5 CC, §Kindergarten, PDF pages 16–17 (printed pages 10–11).",
    verbatim="""> K.CC.5 Count to answer \"how many?\" questions about as many as 20 things arranged in a line, a rectangular array, or a circle, or as many as 10 things in a scattered configuration; given a number from 1–20, count out that many objects.
>
> Later, students can count out a given number of objects, K.CC.5 which is more difficult than just counting that many objects, because counting must be fluent enough for the student to have enough attention to remember the number of objects that is being counted out.""",
    cc_ref="K.CC.4 (one-to-one + cardinality), K.OA.1.",
    can_do=[
        "Count up to 20 objects in a line, rectangular array, or circle.",
        "Count up to 10 objects in a scattered configuration.",
        "Given a target number 1–20, count out that many objects from a larger pile.",
    ],
    misconceptions=[
        "Counting-out is \"more difficult than just counting that many objects\" because the student must hold the target number in working memory while counting — kids who can count to 20 may still fail to count out 7.",
    ],
    progression=[
        "Earlier: K.CC.4 (one-to-one pairing, cardinality).",
        "Later: K.OA.1 (representing addition/subtraction with objects); K.NBT.1 (composing teen numbers).",
    ],
    representations=[
        "Objects in a line, rectangular array, circle, scattered configuration (in order of difficulty).",
        "Pointing / moving objects as the indicating act.",
    ],
)

# ---- K.CC.C — Compare numbers ----------------------------------------------

EXCERPTS["K.CC.C.6"] = dict(
    citation="**Source:** Progressions K–5 CC, §Kindergarten, PDF pages 17–18 (printed pages 11–12).",
    verbatim="""> K.CC.6 Identify whether the number of objects in one group is greater than, less than, or equal to the number of objects in another group, e.g., by using matching and counting strategies.
>
> The standards about comparing numbers K.CC.6, K.CC.7 focus on students identifying which of two groups has more than (or fewer than, or the same amount as) the other. Students first learn to match the objects in the two groups to see if there are any extra and then to count the objects in each group and use their knowledge of the count sequence to decide which number is greater than the other (the number farther along in the count sequence). Students learn that even if one group looks as if it has more objects (e.g., has some extra sticking out), matching or counting may reveal a different result. Comparing numbers progresses in Grade 1 to adding and subtracting in comparing situations (finding out \"how many more\" or \"how many less\" 1.OA.1 and not just \"which is more\" or \"which is less\").""",
    cc_ref="K.CC.7 (compare written numerals); 1.OA.1 (Compare problems).",
    can_do=[
        "Compare two groups of objects by matching one-to-one to see if either group has extras.",
        "Compare two groups by counting each and using count-sequence knowledge (farther along = greater).",
        "Use the language \"greater than,\" \"less than,\" and \"equal to.\"",
    ],
    misconceptions=[
        "Judging \"more\" by visual appearance: \"even if one group looks as if it has more objects (e.g., has some extra sticking out), matching or counting may reveal a different result.\"",
        "Confusing \"less\" with \"more\": \"some children think that 'less' means 'more'\" (p. 21, in Grade-1 Compare context but rooted here).",
    ],
    progression=[
        "Earlier: K.CC.4 (cardinality).",
        "Later: K.CC.7 (compare written numerals); 1.OA.1 Compare problems extend this to finding the difference, not just \"which is more.\"",
    ],
    representations=[
        "Matching objects in two groups one-to-one.",
        "Counting each group and comparing position in the count sequence.",
    ],
)

EXCERPTS["K.CC.C.7"] = dict(
    citation="**Source:** Progressions K–5 CC, §Kindergarten, PDF page 17 (printed page 11). K.CC.7 is named in the standards-margin alongside K.CC.6 and the same paragraph treats both.",
    verbatim="""> K.CC.7 Compare two numbers between 1 and 10 presented as written numerals.
>
> The standards about comparing numbers K.CC.6, K.CC.7 focus on students identifying which of two groups has more than (or fewer than, or the same amount as) the other. […] Students [then] count the objects in each group and use their knowledge of the count sequence to decide which number is greater than the other (the number farther along in the count sequence).""",
    cc_ref="K.CC.6 (compare object groups); 1.NBT.3 (compare two-digit numbers using ą, “, ă).",
    can_do=[
        "Look at two written numerals 1–10 and say which is greater, less, or equal.",
    ],
    misconceptions=[
        "Not explicitly named for K.CC.7. The Progressions notes that comparison generally relies on \"knowledge of the count sequence\" — students who don't yet know the count sequence reliably will struggle here.",
    ],
    progression=[
        "Earlier: K.CC.1 (count sequence), K.CC.6 (compare object groups).",
        "Later: 1.NBT.3 (compare two-digit numbers with symbols ą, “, ă).",
    ],
    representations=[
        "Pairs of written numerals.",
        "Optionally linked back to object-group comparison (K.CC.6).",
    ],
)

# ============================================================================
# K.NBT.A.1
# ============================================================================

EXCERPTS["K.NBT.A.1"] = dict(
    citation="**Source:** Progressions K–5 NBT, §Kindergarten, PDF pages 60–61 (printed pages 54–55).",
    verbatim="""> K.NBT.1 Compose and decompose numbers from 11 to 19 into ten ones and some further ones, e.g., by using objects or drawings, and record each composition or decomposition by a drawing or equation (e.g., 18 = 10 + 8); understand that these numbers are composed of ten ones and one, two, three, four, five, six, seven, eight, or nine ones.
>
> In Kindergarten, teachers help children lay the foundation for understanding the base-ten system by drawing special attention to 10. Children learn to view the whole numbers 11 through 19 as ten ones and some more ones. They decompose 10 into pairs such as 1 + 9, 2 + 8, 3 + 7 and find the number that makes 10 when added to a given number such as 3 (see the OA Progression for further discussion).
>
> Children use objects, math drawings, and equations to describe, explore, and explain how the \"teen numbers,\" the counting numbers from 11 through 19, are ten ones and some more ones. Children can count out a given teen number of objects, e.g., 12, and group the objects to see the ten ones and the two ones. It is also helpful to structure the ten ones into patterns that can be seen as ten objects, such as two fives (see the OA Progression).
>
> A difficulty in the English-speaking world is that the words for teen numbers do not make their base-ten meanings evident. For example, \"eleven\" and \"twelve\" do not sound like \"ten and one\" and \"ten and two.\" The numbers \"thirteen, fourteen, fifteen, … , nineteen\" reverse the order of the ones and tens digits by saying the ones digit first.""",
    cc_ref="K.OA.3 (decompose numbers ≤10), K.OA.4 (partner-to-10), 1.NBT.2 (two-digit numbers as tens and ones).",
    can_do=[
        "View a teen number (11–19) as 10 ones plus some more ones.",
        "Compose and decompose teen numbers using objects, drawings, or equations like 18 = 10 + 8.",
    ],
    misconceptions=[
        "Teen number words obscure base-ten meaning: \"eleven\" and \"twelve\" sound nothing like \"ten and one\" / \"ten and two.\"",
        "Word order reversal: \"thirteen\"–\"nineteen\" say the ones digit first, but the written numeral writes the tens first.",
        "\"Teen\" must be interpreted as \"ten\"; \"thir-\" and \"fif-\" do not clearly say \"three\" and \"five.\"",
        "Initially, a numeral such as 16 looks like \"one, six,\" not \"1 ten and 6 ones.\"",
    ],
    progression=[
        "Earlier: K.CC.4 (cardinality), K.CC.5 (count out objects).",
        "Later: 1.NBT.2 (10 as a bundled unit; full place-value understanding), 1.NBT.4 (adding within 100).",
    ],
    representations=[
        "Objects grouped as ten and some more.",
        "Math drawings (simple drawings showing the math, not pictorial detail).",
        "Equations such as 18 = 10 + 8.",
        "5-frames and 10-frames; \"two fives\" patterns.",
        "Layered place value cards (to see the 10 \"hiding\" inside a teen number).",
    ],
)

# ============================================================================
# 1.OA
# ============================================================================

EXCERPTS["1.OA.A.1"] = dict(
    citation="**Source:** Progressions K–5 OA, §Grade 1, PDF pages 27–28 (printed pages 21–22).",
    verbatim="""> 1.OA.1 Use addition and subtraction within 20 to solve word problems involving situations of adding to, taking from, putting together, taking apart, and comparing, with unknowns in all positions, e.g., by using objects, drawings, and equations with a symbol for the unknown number to represent the problem.
>
> Students extend their work in three major and interrelated ways, by:
> • Representing and solving a new type of problem situation (Compare);
> • Representing and solving the subtypes for all unknowns in all three types;
> • Using Level 2 and Level 3 methods to extend addition and subtraction problem solving beyond 10, to problems within 20.
>
> In a Compare situation, two quantities are compared to find \"How many more\" or \"How many less.\" One reason Compare problems are more advanced than the other two major types is that in Compare problems, one of the quantities (the difference) is not present in the situation physically, and must be conceptualized and constructed in a representation, by showing the \"extra\" that when added to the smaller unknown makes the total equal to the bigger unknown or by finding this quantity embedded within the bigger unknown.""",
    cc_ref="K.OA.1, K.OA.2, K.CC.6 (matching/counting comparisons); 2.OA.1 (extends to within 100 and two-step).",
    can_do=[
        "Solve word problems within 20 across all three situation types (Add To / Take From / Put Together-Take Apart / Compare) with unknowns in any position.",
        "Use objects, drawings, or equations with a symbol for the unknown to represent each problem.",
    ],
    misconceptions=[
        "Compare problems with opposite-language variants (e.g., \"fewer\" suggesting addition, or \"more\" suggesting subtraction) — see Table 2 unshaded cells.",
        "Difficulty with Start Unknown problems: \"some students may also still have difficulty with the conceptual demands of Start Unknown problems.\"",
        "Language: students may \"hear\" only the part about who has more, not how many more.",
        "Some children think \"less\" means \"more.\"",
    ],
    progression=[
        "Earlier: K.OA.1, K.OA.2 (Kindergarten Add To / Take From / Put Together with smaller numbers and limited subtypes — see Table 2 darker shading).",
        "Later: 2.OA.1 extends to within 100, two-step problems, and full mastery of difficult subtypes that begin in Grade 1 (white cells of Table 2).",
    ],
    representations=[
        "Objects, drawings, fingers, math drawings.",
        "Situation equations and solution equations.",
        "Tape diagrams (later in Grade 1).",
        "Matching diagrams for Compare problems.",
    ],
)

EXCERPTS["1.OA.A.2"] = dict(
    citation="**Source:** Progressions K–5 OA, §Grade 1, PDF page 30 (printed page 24).",
    verbatim="""> 1.OA.2 Solve word problems that call for addition of three whole numbers whose sum is less than or equal to 20, e.g., by using objects, drawings, and equations with a symbol for the unknown number to represent the problem.
>
> Level 3 methods involve decomposing an addend and composing it with the other addend to form an equivalent but easier problem. This relies on properties of operations. […] There are a variety of methods to change to an easier problem. These draw on addition of three whole numbers. 1.OA.2 A known addition or subtraction can be used to solve a related addition or subtraction by decomposing one addend and composing it with the other addend. For example, a student can change 8 + 6 to the easier 10 + 4 by decomposing 6 as 2 + 4 and composing the 2 with the 8 to make 10: 8 + 6 = 8 + 2 + 4 = 10 + 4 = 14.""",
    cc_ref="1.OA.3 (properties of operations), 1.OA.6 (make-a-ten strategies).",
    can_do=[
        "Solve word problems that add three whole numbers totaling no more than 20.",
        "Use this to set up Level 3 \"make-a-ten\" strategies (e.g., 8 + 6 = 8 + 2 + 4 = 10 + 4).",
    ],
    misconceptions=[
        "Not explicitly named for 1.OA.2 alone. The Progressions notes that make-a-ten methods are harder in English than in East Asian languages because \"fourteen\" reverses the digit order of 14 (p. 25).",
    ],
    progression=[
        "Earlier: 1.OA.1 (single-step problems), K.OA.4 (partner-to-10), K.OA.3 (decompositions ≤ 10).",
        "Later: 1.OA.6 (make-a-ten Level 3 strategies), 2.OA.1 (two-step problems).",
    ],
    representations=[
        "Objects, drawings, equations with a symbol for the unknown.",
        "Decomposition diagrams showing how three addends regroup.",
    ],
)

EXCERPTS["1.OA.B.3"] = dict(
    citation="**Source:** Progressions K–5 OA, §Grade 1, PDF page 30 (printed page 24).",
    verbatim="""> 1.OA.3 Apply properties of operations as strategies to add and subtract. Students need not use formal terms for these properties.
>
> Level 3 methods involve decomposing an addend and composing it with the other addend to form an equivalent but easier problem. This relies on properties of operations. 1.OA.3 Students do not necessarily have to justify their representations or solutions using properties, but they can begin to learn to recognize these properties in action and discuss their use after solving.
>
> [And from p. 23:] Students might also use the commutative property to shorten tasks, by counting on from the larger addend even if it is second (e.g., for 4 + 9, counting on from 9 instead of from 4).""",
    cc_ref="1.OA.6 (make-a-ten); 3.OA.5 (extending properties to multiplication).",
    can_do=[
        "Use the commutative property (informally) to count on from the larger addend regardless of order.",
        "Use the associative property (informally) to regroup three addends into easier sums (make-a-ten).",
    ],
    misconceptions=[
        "Not explicitly named in the Progressions for 1.OA.3.",
    ],
    progression=[
        "Earlier: K.OA.3, K.OA.4.",
        "Later: 1.OA.6 (Level 3 fluency); 3.OA.5 (properties extend to multiplication).",
    ],
    representations=[
        "Drawings showing decomposition/recomposition of addends.",
        "Equations such as 8 + 6 = 8 + 2 + 4 = 10 + 4 = 14.",
    ],
)

EXCERPTS["1.OA.B.4"] = dict(
    citation="**Source:** Progressions K–5 OA, §Grade 1, PDF page 28 (printed page 22).",
    verbatim="""> 1.OA.4 Understand subtraction as an unknown-addend problem.
>
> Put Together/Take Apart problems with Addend Unknown afford students the opportunity to see subtraction as \"undoing\" addition in a different way than as reversing the action, namely as finding an unknown addend. 1.OA.4 The meaning of subtraction as an unknown-addend addition problem is one of the essential understandings students will need in middle grades in order to extend arithmetic to negative rational numbers.""",
    cc_ref="1.OA.6 (counting on for subtraction), 1.OA.8.",
    can_do=[
        "See a subtraction like 10 − 4 as the equivalent unknown-addend problem 4 + ? = 10.",
        "Use this view to solve subtraction by counting on.",
    ],
    misconceptions=[
        "Not explicitly named, but the Progressions notes (p. 24) that \"counting down\" is more difficult than counting on, and that taking-away interpretations can crowd out the unknown-addend view if not handled carefully.",
    ],
    progression=[
        "Earlier: K.OA.2 (taking-from situations).",
        "Later: 1.OA.6 (Level 2 counting-on for subtraction), foundation for negative rationals in middle grades.",
    ],
    representations=[
        "Equations like 4 + ? = 10 paired with 10 − 4 = ?.",
        "Drawings showing the total and one addend, with the other addend as the unknown gap.",
    ],
)

EXCERPTS["1.OA.C.5"] = dict(
    citation="**Source:** Progressions K–5 OA, §Grade 1, PDF pages 29–30 (printed pages 23–24).",
    verbatim="""> 1.OA.5 Relate counting to addition and subtraction (e.g., by counting on 2 to add 2).
>
> The advance from Level 1 methods to Level 2 methods can be clearly seen in the context of situations with unknown addends. […] But a Level 2 counting on solution involves seeing the 9 as part of 13, and understanding that counting the 9 things can be \"taken as done\" if we begin the count from 9: thus the student may say, \"Niiiiine, ten, eleven, twelve, thirteen.\" Students keep track of how many they counted on (here, 4) with fingers, mental images, or physical actions such as head bobs. Elongating the first counting word (\"Niiiiine . . .\") is natural and indicates that the student differentiates between the first addend and the counts for the second addend.
>
> Counting on should be seen as a thinking strategy, not a rote method. It involves seeing the first addend as embedded in the total, and it involves a conceptual interplay between counting and the cardinality in the first addend (shifting from the cardinal meaning of the first addend to the counting meaning).""",
    cc_ref="K.CC.2, K.CC.4c; 1.OA.6.",
    can_do=[
        "Add by counting on from an addend (e.g., for 9 + 4, start at 9 and count on 4).",
        "Subtract by counting on from the known addend to the total (unknown-addend view of subtraction).",
    ],
    misconceptions=[
        "Treating counting on as rote rather than as a thinking strategy that requires seeing one addend as embedded in the total.",
    ],
    progression=[
        "Earlier: K.CC.4c (each next number is one more); K.CC.2 (count forward from any number).",
        "Later: 1.OA.6 (make-a-ten Level 3); 2.OA.2 (fluent within 20).",
    ],
    representations=[
        "Fingers, mental images, or head bobs to track the count on.",
        "Verbal elongation of the first addend (\"Niiiiine…\") to mark the shift from cardinal to counting use.",
    ],
)

EXCERPTS["1.OA.C.6"] = dict(
    citation="**Source:** Progressions K–5 OA, §Grade 1, PDF pages 29–31 (printed pages 23–25).",
    verbatim="""> 1.OA.6 Add and subtract within 20, demonstrating fluency for addition and subtraction within 10. Use strategies such as counting on; making ten (e.g., 8 + 6 = 8 + 2 + 4 = 10 + 4 = 14); decomposing a number leading to a ten (e.g., 13 − 4 = 13 − 3 − 1 = 10 − 1 = 9); using the relationship between addition and subtraction (e.g., knowing that 8 + 4 = 12, one knows 12 − 8 = 4); and creating equivalent but easier or known sums (e.g., adding 6 + 7 by creating the known equivalent 6 + 6 + 1 = 12 + 1 = 13).
>
> These make-a-ten methods have three prerequisites reaching back to Kindergarten:
> a. knowing the partner that makes 10 for any number (K.OA.4 sets the stage for this),
> b. knowing all decompositions for any number below 10 (K.OA.3 sets the stage for this), and
> c. knowing all teen numbers as 10 + n (e.g., 12 = 10 + 2, 15 = 10 + 5, see K.NBT.1 and 1.NBT.2b).
>
> The make-a-ten methods are more difficult in English than in East Asian languages in which teen numbers are spoken as ten, ten one, ten two, ten three, etc. In particular, prerequisite c is harder in English because of the irregularities and reversals in the teen number words.""",
    cc_ref="K.OA.3, K.OA.4, K.NBT.1, 1.NBT.2b; 2.OA.2 (fluent within 20 by end of Grade 2).",
    can_do=[
        "Fluently add and subtract within 10.",
        "Add and subtract within 20 using counting on, make-a-ten, decomposing leading to a ten, doubles ±1/±2, and the addition–subtraction relationship.",
    ],
    misconceptions=[
        "Make-a-ten is harder in English because of teen-word irregularities (\"fourteen\" reverses the digit order in 14).",
        "Counting down for subtraction is more difficult than counting on (p. 24).",
    ],
    progression=[
        "Earlier: K.OA.3 (decompositions), K.OA.4 (partner-to-10), K.NBT.1 (teen numbers as 10 + n).",
        "Later: 2.OA.2 (fluent within 20 mental strategies by end of Grade 2; know sums from memory).",
    ],
    representations=[
        "5-and-10 patterns (rows of five plus extra ones).",
        "Number-bond, part-whole, and tape diagrams (later in Grade 1).",
        "Fingers / head bobs / mental images for tracking counts.",
        "Equations showing decomposition (e.g., 8 + 6 = 8 + 2 + 4 = 10 + 4 = 14).",
    ],
)

EXCERPTS["1.OA.D.7"] = dict(
    citation="**Source:** Progressions K–5 OA, §Grade 1, PDF page 31 (printed page 25), with surrounding context on equations as showing same value.",
    verbatim="""> 1.OA.7 Understand the meaning of the equal sign, and determine if equations involving addition and subtraction are true or false.
>
> [From p. 19, on the foundation laid in Kindergarten:] Equations with one number on the left and an operation on the right (e.g., 5 = 2 + 3 to record a group of 5 things decomposed as a group of 2 things and a group of 3 things) allow students to understand equations as showing in various ways that the expressions on both sides have the same value. MP.6 Working toward \"using the equal sign consistently and appropriately.\"
>
> [And from Grade 1 p. 22, on related equations:] Each addition and subtraction equation has seven related equations. […continuing in Grade 2…] Students can write all of these equations, continuing to connect addition and subtraction, and their experience with equations of various forms.""",
    cc_ref="K.OA.3 (decomposition equations), 1.OA.8.",
    can_do=[
        "Recognize the equal sign as meaning \"is the same number as\" — both sides have the same value.",
        "Judge equations like 6 = 6, 7 = 8 − 1, 5 + 2 = 2 + 5, 4 + 1 = 5 + 2 as true or false.",
    ],
    misconceptions=[
        "Treating the equal sign as meaning \"makes\" or \"results in\" rather than \"is the same number as\" (sidebar p. 19).",
        "The Kindergarten sidebar on p. 17 notes that initially, in Add To / Take From situations, \"the equal sign is used with the meaning of 'becomes,' rather than the more general 'equals.'\"",
    ],
    progression=[
        "Earlier: K.OA.3 (equations with total on the left, like 5 = 2 + 3).",
        "Later: 1.OA.8 (find unknowns in any position); 2.OA.1 (related-equation families); algebraic foundations.",
    ],
    representations=[
        "Equations with the total on the left (5 = 2 + 3) and on the right.",
        "Pairs/sets of related equations from one fact family.",
    ],
)

EXCERPTS["1.OA.D.8"] = dict(
    citation="**Source:** Progressions K–5 OA, §Grade 1, PDF pages 28–31 (printed pages 22–25).",
    verbatim="""> 1.OA.8 Determine the unknown whole number in an addition or subtraction equation relating three whole numbers.
>
> Students [in Grade 1] gain experience with the more difficult and more \"algebraic\" problem subtypes in which a situation equation does not immediately lead to the answer. For example, a student analyzing a Take From problem with Change Unknown might write the situation equation 14 − ? = 8. This equation does not immediately lead to the answer. To make progress, the student can write a related equation called a solution equation — in this case, either 8 + ? = 14 or 14 − 8 = ?. These equations both lead to the answer by Level 2 or Level 3 strategies.
>
> Students thus begin developing an algebraic perspective many years before they will use formal algebraic symbols and methods. They read to understand the problem situation, represent the situation and its quantitative relationships with expressions and equations, and then manipulate that representation if necessary, using properties of operations and/or relationships between operations.""",
    cc_ref="1.OA.4, 1.OA.6, 1.OA.7; 2.OA.1.",
    can_do=[
        "Find the unknown number in equations like 8 + ? = 11, 5 = ? − 3, 6 + 6 = ?.",
        "Rewrite a situation equation as a solution equation when the situation equation does not immediately give the answer.",
    ],
    misconceptions=[
        "Difficulty with Start Unknown and Change Unknown problems where the situation equation does not lead directly to the answer (p. 23).",
    ],
    progression=[
        "Earlier: 1.OA.4 (subtraction as unknown addend), 1.OA.7 (equal-sign meaning).",
        "Later: 2.OA.1 (within 100, two-step); algebraic reasoning in later grades.",
    ],
    representations=[
        "Situation equations (e.g., 14 − ? = 8) paired with solution equations (8 + ? = 14).",
        "Diagrams of the seven related equations in a fact family.",
    ],
)

# ============================================================================
# 1.NBT
# ============================================================================

EXCERPTS["1.NBT.A.1"] = dict(
    citation="**Source:** Progressions K–5 NBT, §Grade 1, PDF page 62 (printed page 56).",
    verbatim="""> 1.NBT.1 Count to 120, starting at any number less than 120. In this range, read and write numerals and represent a number of objects with a written numeral.
>
> Via structured learning time, discussion, and practice students learn patterns in spoken number words and in written numerals, and how the two are related.
>
> [Sidebar:] In the classroom, a list of the numerals from 1 to 120 can be shown in columns of 10 to help highlight the base-ten structure, e.g., in the leftmost column, the 9s (indicating 9 tens) are lined up and the ones increase by 1 from 91 to 99. The numbers 101, …, 120 may be especially difficult for children to write because they want to write the counting number they hear (e.g., one hundred six is 1006). But each place of a written numeral must have exactly one digit in it. Omitting a digit or writing more than one digit in a place moves other digits to the left or right of their correct places. A digit can be 0, which can be thought of as using 0 as a placeholder.""",
    cc_ref="K.CC.1, K.CC.3; 1.NBT.2.",
    can_do=[
        "Count to 120 starting at any number less than 120.",
        "Read and write numerals 1–120.",
        "Represent a group of objects with a written numeral within 120.",
    ],
    misconceptions=[
        "Writing \"one hundred six\" as 1006 — \"each place of a written numeral must have exactly one digit in it. Omitting a digit or writing more than one digit in a place moves other digits to the left or right of their correct places.\"",
        "Decade-word crossings: errors like \"twenty-nine, twenty-ten, twenty-eleven, twenty-twelve\" (p. 56).",
    ],
    progression=[
        "Earlier: K.CC.1 (count to 100), K.CC.3 (write numbers 0–20).",
        "Later: 1.NBT.2 (two-digit place value); 2.NBT.3 (read and write to 1000).",
    ],
    representations=[
        "Numerals listed in columns of 10 to highlight base-ten structure.",
        "Layered place value cards.",
    ],
)

# 1.NBT.B.2 + subparts
_NBT_2_BASE = dict(
    citation="**Source:** Progressions K–5 NBT, §Grade 1, PDF page 62 (printed page 56).",
    verbatim="""> 1.NBT.2 Understand that the two digits of a two-digit number represent amounts of tens and ones. Understand the following as special cases:
> a. 10 can be thought of as a bundle of ten ones — called a \"ten.\"
> b. The numbers from 11 to 19 are composed of a ten and one, two, three, four, five, six, seven, eight, or nine ones.
> c. The numbers 10, 20, 30, 40, 50, 60, 70, 80, 90 refer to one, two, three, four, five, six, seven, eight, or nine tens (and 0 ones).
>
> Grade 1 students take the important step of viewing ten ones as a unit called a \"ten.\" 1.NBT.2a They learn to view the numbers 11 through 19 as composed of 1 ten and some ones. 1.NBT.2b They learn to view the decade numbers 10, …, 90, in written and in spoken form, as 1 ten, …, 9 tens. 1.NBT.2c More generally, first graders learn that the two digits of a two-digit number represent amounts of tens and ones, e.g., 67 represents 6 tens and 7 ones. Saying 67 as \"6 tens, 7 ones\" as well as \"sixty-seven\" can help students focus on the tens and ones structure of written numerals.
>
> The number words continue to require attention at first grade because of their irregularities. The decade words, \"twenty,\" \"thirty,\" \"forty,\" etc., must be understood as indicating 2 tens, 3 tens, 4 tens, etc. Many decade number words sound much like teen number words. For example, \"fourteen\" and \"forty\" sound very similar, as do \"fifteen\" and \"fifty,\" and so on to \"nineteen\" and \"ninety.\"""",
    cc_ref="K.NBT.1; 2.NBT.1 (hundreds).",
    misconceptions=[
        "Confusing teen number words with decade words (\"fourteen\" vs. \"forty,\" \"fifteen\" vs. \"fifty\").",
        "Decade words don't clearly indicate they mean a number of tens: \"-ty\" does mean tens but not clearly so.",
        "Count errors crossing decades: \"twenty-nine, twenty-ten, twenty-eleven, twenty-twelve.\"",
    ],
    progression_base=[
        "Earlier: K.NBT.1 (teen numbers as 10 + n).",
        "Later: 1.NBT.3 (compare two-digit), 1.NBT.4–6 (add/subtract using place value); 2.NBT.1 (hundreds).",
    ],
    representations=[
        "Layered place value cards.",
        "Math drawings showing tens as bundles or strips.",
        "Saying \"6 tens, 7 ones\" alongside \"sixty-seven.\"",
    ],
)

EXCERPTS["1.NBT.B.2"] = dict(
    citation=_NBT_2_BASE["citation"],
    verbatim=_NBT_2_BASE["verbatim"],
    cc_ref=_NBT_2_BASE["cc_ref"],
    can_do=[
        "Understand a two-digit number as some tens and some ones.",
        "Decompose any two-digit number into its tens and ones.",
    ],
    misconceptions=_NBT_2_BASE["misconceptions"],
    progression=_NBT_2_BASE["progression_base"],
    representations=_NBT_2_BASE["representations"],
)

EXCERPTS["1.NBT.B.2a"] = dict(
    citation=_NBT_2_BASE["citation"],
    verbatim=_NBT_2_BASE["verbatim"],
    cc_ref=_NBT_2_BASE["cc_ref"],
    can_do=[
        "View 10 as a bundle of ten ones — a single unit called a \"ten.\"",
    ],
    misconceptions=_NBT_2_BASE["misconceptions"],
    progression=_NBT_2_BASE["progression_base"],
    representations=_NBT_2_BASE["representations"],
)

EXCERPTS["1.NBT.B.2b"] = dict(
    citation=_NBT_2_BASE["citation"],
    verbatim=_NBT_2_BASE["verbatim"],
    cc_ref=_NBT_2_BASE["cc_ref"],
    can_do=[
        "View 11–19 as composed of 1 ten and 1, 2, 3, 4, 5, 6, 7, 8, or 9 ones.",
    ],
    misconceptions=_NBT_2_BASE["misconceptions"],
    progression=_NBT_2_BASE["progression_base"],
    representations=_NBT_2_BASE["representations"],
)

EXCERPTS["1.NBT.B.2c"] = dict(
    citation=_NBT_2_BASE["citation"],
    verbatim=_NBT_2_BASE["verbatim"],
    cc_ref=_NBT_2_BASE["cc_ref"],
    can_do=[
        "View the decade numbers 10, 20, 30, …, 90 as 1 ten, 2 tens, …, 9 tens (with 0 ones).",
    ],
    misconceptions=_NBT_2_BASE["misconceptions"],
    progression=_NBT_2_BASE["progression_base"],
    representations=_NBT_2_BASE["representations"],
)

EXCERPTS["1.NBT.B.3"] = dict(
    citation="**Source:** Progressions K–5 NBT, §Grade 1, PDF page 62 (printed page 56).",
    verbatim="""> 1.NBT.3 Compare two two-digit numbers based on meanings of the tens and ones digits, recording the results of comparisons with the symbols ą, “, and ă.
>
> Grade 1 students use their base-ten work to help them recognize that the digit in the tens place is more important for determining the size of a two-digit number. 1.NBT.3 They use this understanding to compare two two-digit numbers, indicating the result with the symbols ą, “, and ă. Correctly placing the ă and ą symbols is a challenge for early learners. Accuracy can improve if students think of putting the wide part of the symbol next to the larger number.
>
> [Sidebar:] The widespread eating analogy (the alligator or big fish eats the little fish) is problematic because it is external to the symbols themselves and can be scary for some children, especially little ones. Explanations such as \"the bigger part of the symbol is next to the bigger number\" stay within the realm of mathematics.""",
    cc_ref="K.CC.7, 1.NBT.2; 2.NBT.4.",
    can_do=[
        "Compare two two-digit numbers by inspecting the tens digit first.",
        "Record comparisons with ą, “, ă.",
    ],
    misconceptions=[
        "Placing the ą / ă symbol incorrectly: \"correctly placing the ă and ą symbols is a challenge for early learners.\"",
        "Over-relying on the alligator/fish-eating metaphor — \"problematic because it is external to the symbols themselves and can be scary for some children.\"",
    ],
    progression=[
        "Earlier: K.CC.7 (compare numerals to 10), 1.NBT.2 (place value).",
        "Later: 2.NBT.4 (compare three-digit numbers).",
    ],
    representations=[
        "Place value drawings and cards.",
        "The ą / ă / “ symbols themselves with the explanation that the wide part is next to the larger number.",
    ],
)

EXCERPTS["1.NBT.C.4"] = dict(
    citation="**Source:** Progressions K–5 NBT, §Grade 1, PDF page 63 (printed page 57).",
    verbatim="""> 1.NBT.4 Add within 100, including adding a two-digit number and a one-digit number, and adding a two-digit number and a multiple of 10, using concrete models or drawings and strategies based on place value, properties of operations, and/or the relationship between addition and subtraction; relate the strategy to a written method and explain the reasoning used. Understand that in adding two-digit numbers, one adds tens and tens, ones and ones; and sometimes it is necessary to compose a ten.
>
> First graders use their base-ten work to compute sums within 100 with understanding. […] Combining tens and ones separately […] can be extended to the general method of combining like base-ten units. […] Like base-ten units can be combined in any order, but going from smaller to larger eliminates the need to go back to a given place to add in a new unit. For example, in computing 46 + 37 by combining tens, then ones (going left to right), one needs to go back to add in the new 1 ten: \"4 tens and 3 tens is 7 tens, 6 ones and 7 ones is 13 ones which is 1 ten and 3 ones, 7 tens and 1 ten is 8 tens. The total is 8 tens and 3 ones: 83.\"
>
> Students may also develop sequence methods that extend their Level 2 single-digit counting on strategies to counting on by tens and ones, or mixtures of such strategies. […] Using objects or drawings that show the ones as rows of five plus extra ones can support students' extension of the Level 3 make-a-ten methods.""",
    cc_ref="1.OA.6 (make-a-ten); 2.NBT.5 (fluent within 100).",
    can_do=[
        "Add a two-digit number and a one-digit number within 100.",
        "Add a two-digit number and a multiple of 10 within 100.",
        "Use concrete models, drawings, place-value strategies, properties of operations, or the addition–subtraction relationship.",
        "Compose a ten when ones sum to 10 or more.",
        "Relate the chosen strategy to a written method and explain.",
    ],
    misconceptions=[
        "Forgetting to compose a ten when ones sum to ≥10.",
        "When working left-to-right, needing to go back to add in a new ten — the Progressions notes this is harder than working right-to-left.",
    ],
    progression=[
        "Earlier: 1.OA.6 (make-a-ten within 20); 1.NBT.2 (place value).",
        "Later: 1.NBT.5/1.NBT.6; 2.NBT.5/2.NBT.7 (fluent within 100 / within 1000).",
    ],
    representations=[
        "Concrete objects (counters, bundles), drawings, place value cards.",
        "Rows-of-five ones drawings to support make-a-ten.",
        "Written methods recorded alongside the drawing, with the new ten written on the line below.",
    ],
)

EXCERPTS["1.NBT.C.5"] = dict(
    citation="**Source:** Progressions K–5 NBT, §Grade 1, PDF page 63 (printed page 57).",
    verbatim="""> 1.NBT.5 Given a two-digit number, mentally find 10 more or 10 less than the number, without having to count; explain the reasoning used.
>
> First graders also engage in mental calculation, such as mentally finding 10 more or 10 less than a given two-digit number without having to count by ones. 1.NBT.5 They may explain their reasoning by saying that they have one more or one less ten than before. Drawings and layered cards can afford connections with place value and be used in explanations.""",
    cc_ref="1.NBT.2, 1.NBT.4; 2.NBT.8.",
    can_do=[
        "Mentally find 10 more or 10 less than any two-digit number — no counting by ones.",
        "Explain the reasoning as \"one more (or one less) ten.\"",
    ],
    misconceptions=[
        "Not explicitly named in the Progressions for 1.NBT.5.",
    ],
    progression=[
        "Earlier: 1.NBT.2 (place value).",
        "Later: 2.NBT.8 (mentally add/subtract 10 or 100 within 100–900).",
    ],
    representations=[
        "Layered place value cards.",
        "Drawings linked to place value.",
    ],
)

EXCERPTS["1.NBT.C.6"] = dict(
    citation="**Source:** Progressions K–5 NBT, §Grade 1, PDF page 63 (printed page 57).",
    verbatim="""> 1.NBT.6 Subtract multiples of 10 in the range 10–90 from multiples of 10 in the range 10–90 (positive or zero differences), using concrete models or drawings and strategies based on place value, properties of operations, and/or the relationship between addition and subtraction; relate the strategy to a written method and explain the reasoning used.
>
> In Grade 1, children learn to compute differences of two-digit numbers for limited cases. 1.NBT.6 Differences of multiples of 10, such as 70 − 40 can be viewed as 7 tens minus 4 tens and represented with objects, e.g., objects bundled in tens, or drawings. Children use the relationship between subtraction and addition when they view 80 − 70 as an unknown addend addition problem, 70 + ? = 80, and reason that 1 ten must be added to 70 to make 80, so 80 − 70 = 10.
>
> First graders are not expected to compute differences of two-digit numbers other than multiples of ten. Deferring such work until Grade 2 allows two-digit subtraction with and without decomposing to occur in close succession, highlighting the similarity between these two cases. This helps students to avoid making the generalization \"in each column, subtract the larger digit from the smaller digit, independent of whether the larger digit is in the subtrahend or minuend,\" e.g., making the error 82 − 45 = 43.""",
    cc_ref="1.OA.4 (unknown-addend subtraction); 2.NBT.5, 2.NBT.7.",
    can_do=[
        "Subtract a multiple of 10 from a multiple of 10 in the range 10–90.",
        "View 70 − 40 as 7 tens − 4 tens.",
        "Solve via the unknown-addend relationship (70 + ? = 80 ⇒ 80 − 70 = 10).",
        "Explain the reasoning and relate it to a written method.",
    ],
    misconceptions=[
        "Without careful sequencing in Grade 2, students may overgeneralize to \"in each column, subtract the larger digit from the smaller digit\" — leading to errors like 82 − 45 = 43.",
    ],
    progression=[
        "Earlier: 1.OA.4 (subtraction as unknown addend), 1.NBT.4 (adding within 100).",
        "Later: 2.NBT.5 (fluent within 100), 2.NBT.7 (within 1000 with decomposition).",
    ],
    representations=[
        "Bundled-tens objects or drawings.",
        "Unknown-addend equations.",
    ],
)

# ============================================================================
# 2.OA
# ============================================================================

EXCERPTS["2.OA.A.1"] = dict(
    citation="**Source:** Progressions K–5 OA, §Grade 2, PDF page 33 (printed page 27).",
    verbatim="""> 2.OA.1 Use addition and subtraction within 100 to solve one- and two-step word problems involving situations of adding to, taking from, putting together, taking apart, and comparing, with unknowns in all positions, e.g., by using drawings and equations with a symbol for the unknown number to represent the problem.
>
> Grade 2 students build upon their work in Grade 1 in two major ways. They represent and solve situational problems of all three types which involve addition and subtraction within 100 rather than within 20, and they represent and solve two-step situational problems of all three types.
>
> Diagrams used in Grade 1 to show how quantities in the situation are related continue to be useful in Grade 2, and students continue to relate the diagrams to situation equations. Such relating helps students rewrite a situation equation like ? − 38 = 49 as 49 + 38 = ? because they see that the first number in the subtraction equation is the total. Each addition and subtraction equation has seven related equations.
>
> Because there are so many problem situation subtypes, there are many possible ways to combine such subtypes to devise two-step problems. Because some Grade 2 students are still developing proficiency with the most difficult subtypes, two-step problems should not involve these subtypes. Most work with two-step problems should involve single-digit addends.""",
    cc_ref="1.OA.1; 1.NBT.4–6; 3.OA.8 (two-step problems with four operations).",
    can_do=[
        "Solve one- and two-step word problems within 100, all three situation types, all unknown positions.",
        "Use drawings and equations with a symbol for the unknown.",
        "Rewrite a situation equation as a solution equation (e.g., ? − 38 = 49 → 49 + 38 = ?).",
    ],
    misconceptions=[
        "Compare problems with opposite-language variants and Start Unknown problems remain difficult into Grade 2.",
        "Two-step problems should NOT use the most difficult subtypes for students still developing proficiency.",
    ],
    progression=[
        "Earlier: 1.OA.1 (within 20).",
        "Later: 3.OA.8 (two-step with four operations); 4.OA.3 (multistep).",
    ],
    representations=[
        "Drawings (tape diagrams, part-whole diagrams).",
        "Situation equations and solution equations.",
        "Number-bond diagrams.",
    ],
)

EXCERPTS["2.OA.B.2"] = dict(
    citation="**Source:** Progressions K–5 OA, §Grade 2, PDF pages 33–34 (printed pages 27–28).",
    verbatim="""> 2.OA.2 Fluently add and subtract within 20 using mental strategies. By end of Grade 2, know from memory all sums of two one-digit numbers. (See standard 1.OA.6 for a list of mental strategies.)
>
> The deep extended experiences students have with addition and subtraction in Kindergarten and Grade 1 culminate in Grade 2 with students becoming fluent in single-digit additions and the related subtractions using the mental Level 2 and 3 strategies as needed. So fluency in adding and subtracting single-digit numbers has progressed from numbers within 5 in Kindergarten to within 10 in Grade 1 to within 20 in Grade 2. The methods have also become more advanced.
>
> The word fluent is used in the Standards to mean \"fast and accurate.\" Fluency in each grade involves a mixture of just knowing some answers, knowing some answers from patterns (e.g., \"adding 0 yields the same number\"), and knowing some answers from the use of strategies. It is important to push sensitively and encouragingly toward fluency of the designated numbers at each grade level, recognizing that fluency will be a mixture of these kinds of thinking which may differ across students. […] By the end of the K–2 grade span, students have sufficient experience with addition and subtraction to know single-digit sums from memory; as should be clear from the foregoing, this is not a matter of instilling facts divorced from their meanings, but rather as an outcome of a multi-year process that heavily involves the interplay of practice and reasoning.""",
    cc_ref="K.OA.5, 1.OA.6.",
    can_do=[
        "Fluently (\"fast and accurate\") add and subtract within 20 using mental strategies.",
        "Know from memory all sums of two one-digit numbers by end of Grade 2.",
    ],
    misconceptions=[
        "Equating fluency with drill divorced from meaning — the Progressions explicitly warns: \"not a matter of instilling facts divorced from their meanings.\"",
    ],
    progression=[
        "Earlier: K.OA.5 (within 5), 1.OA.6 (within 20 with strategies).",
        "Later: 2.NBT.5 (fluent multi-digit within 100); foundation for 3.OA work.",
    ],
    representations=[
        "Mental strategies inherited from 1.OA.6: counting on, make-a-ten, doubles ±1/±2, addition–subtraction relationship.",
    ],
)

EXCERPTS["2.OA.C.3"] = dict(
    citation="**Source:** Progressions K–5 OA, §Grade 3 (which discusses 2.OA.3 and 2.OA.4 as Level-1 multiplication preparation), PDF page 40 (printed page 34).",
    verbatim="""> 2.OA.3 Determine whether a group of objects (up to 20) has an odd or even number of members, e.g., by pairing objects or counting them by 2s; write an equation to express an even number as a sum of two equal addends.
>
> The Grade 2 standards 2.OA.3 and 2.OA.4 are at this level [Level 1: making and counting all of the quantities] but set the stage for Level 2. Standard 2.OA.3 relates doubles additions up to 20 to the concept of odd and even numbers and to counting by 2s (the easiest count-by in Level 2) by pairing and counting by 2s the things in each addend.""",
    cc_ref="1.OA.6 (doubles); 2.NBT.2 (skip-counting by 2s, 5s); 3.OA (multiplication).",
    can_do=[
        "Decide whether a group of up to 20 objects has an odd or even number.",
        "Pair objects or count them by 2s to test even/odd.",
        "Write an equation that expresses an even number as a sum of two equal addends (e.g., 8 = 4 + 4).",
    ],
    misconceptions=[
        "Not explicitly named for 2.OA.3 in the Progressions.",
    ],
    progression=[
        "Earlier: 1.OA.6 (doubles strategies).",
        "Later: 3.OA.1 (interpret products of whole numbers — multiplication built on equal-group reasoning).",
    ],
    representations=[
        "Objects paired up two-by-two.",
        "Skip-counting by 2s.",
        "Equations expressing an even total as two equal addends.",
    ],
)

EXCERPTS["2.OA.C.4"] = dict(
    citation="**Source:** Progressions K–5 OA, §Grade 3 (which discusses 2.OA.4 as Level-1 preparation for multiplication), PDF page 40 (printed page 34).",
    verbatim="""> 2.OA.4 Use addition to find the total number of objects arranged in rectangular arrays with up to 5 rows and up to 5 columns; write an equation to express the total as a sum of equal addends.
>
> [2.OA.4] focuses on using addition to find the total number of objects arranged in rectangular arrays (up to 5 by 5).
>
> [Sidebar — Supporting Level 2 methods with arrays:] Small arrays (up to 5 × 5) support seeing and beginning to learn the Level 2 count-bys for the first five equal groups of the small numbers 2 through 5 if the running total is written to the right of each row (e.g., 3, 6, 9, 12, 15). Students may write repeated additions and then count by ones without the objects, often emphasizing each last number said for each group. Grade 3 students can be encouraged to move as early as possible from equal groups or array models that show all of the quantities to similar representations using diagrams that show relationships of numbers because diagrams are faster and less error-prone and support methods at Level 2 and Level 3.""",
    cc_ref="2.OA.3; 3.OA.1 (multiplication as equal groups); 3.OA.3 (arrays).",
    can_do=[
        "Find the total number of objects in a rectangular array up to 5 × 5 by adding equal addends.",
        "Write an equation expressing the total as a sum of equal addends (e.g., 3 + 3 + 3 + 3 = 12).",
    ],
    misconceptions=[
        "Not explicitly named for 2.OA.4. The Progressions cautions (p. 34) against staying too long at Level 1 with all objects shown — by Grade 3, students should move to relational diagrams.",
    ],
    progression=[
        "Earlier: 1.OA.6 (addition fluency), 2.OA.2.",
        "Later: 3.OA.1 (interpret products), 3.OA.3 (multiplication with arrays).",
    ],
    representations=[
        "Small rectangular arrays (up to 5 × 5).",
        "Running totals written to the right of each row.",
        "Equal-addend equations.",
    ],
)

# ============================================================================
# 2.NBT
# ============================================================================

_NBT2_1_BASE = dict(
    citation="**Source:** Progressions K–5 NBT, §Grade 2, PDF page 64 (printed page 58).",
    verbatim="""> 2.NBT.1 Understand that the three digits of a three-digit number represent amounts of hundreds, tens, and ones; e.g., 706 equals 7 hundreds, 0 tens, and 6 ones. Understand the following as special cases:
> a. 100 can be thought of as a bundle of ten tens — called a \"hundred.\"
> b. The numbers 100, 200, 300, 400, 500, 600, 700, 800, 900 refer to one, two, three, four, five, six, seven, eight, or nine hundreds (and 0 tens and 0 ones).
>
> At Grade 2, students extend their base-ten understanding to hundreds. […] In Grade 2, students extend their understanding of the base-ten system by viewing 10 tens as forming a new unit called a \"hundred.\" 2.NBT.1a This lays the groundwork for understanding the structure of the base-ten system as based in repeated bundling in groups of 10 and understanding that the unit associated with each place is 10 of the unit associated with the place to its right.
>
> Representations such as manipulative materials, math drawings, and layered three-digit place value cards afford connections between written three-digit numbers and hundreds, tens, and ones. […] Unlike the decade words, the hundreds words explicitly indicate base-ten units. For example, it takes interpretation to understand that \"fifty\" means five tens, but \"five hundred\" means almost what it says (\"five hundred\" rather than \"five hundreds\"). Even so, this doesn't mean that students automatically understand 500 as 5 hundreds; they may still only think of it as the number said after 499 or reached after 500 counts of 1.""",
    cc_ref="1.NBT.2; 4.NBT.1 (extension to ten thousands and beyond).",
    misconceptions=[
        "Decade words don't clearly indicate \"tens\" (\"fifty\" doesn't sound like \"five tens\").",
        "Even hundreds words can be misread: students may think of 500 only as \"the number after 499,\" not as 5 hundreds.",
    ],
    progression=[
        "Earlier: 1.NBT.2 (tens and ones).",
        "Later: 2.NBT.3 (read/write to 1000), 2.NBT.4 (compare); 4.NBT.1 generalizes the ×10 place-value relationship.",
    ],
    representations=[
        "Manipulative materials (base-ten blocks).",
        "Math drawings showing hundreds as quick units.",
        "Layered three-digit place value cards.",
    ],
)

EXCERPTS["2.NBT.A.1"] = dict(
    citation=_NBT2_1_BASE["citation"],
    verbatim=_NBT2_1_BASE["verbatim"],
    cc_ref=_NBT2_1_BASE["cc_ref"],
    can_do=[
        "Understand the three digits of a three-digit number as amounts of hundreds, tens, and ones.",
        "Read 706 as 7 hundreds, 0 tens, 6 ones (and recognize 0 as a placeholder).",
    ],
    misconceptions=_NBT2_1_BASE["misconceptions"],
    progression=_NBT2_1_BASE["progression"],
    representations=_NBT2_1_BASE["representations"],
)

EXCERPTS["2.NBT.A.1a"] = dict(
    citation=_NBT2_1_BASE["citation"],
    verbatim=_NBT2_1_BASE["verbatim"],
    cc_ref=_NBT2_1_BASE["cc_ref"],
    can_do=[
        "View 100 as a bundle of ten tens — a new unit called a \"hundred.\"",
    ],
    misconceptions=_NBT2_1_BASE["misconceptions"],
    progression=_NBT2_1_BASE["progression"],
    representations=_NBT2_1_BASE["representations"],
)

EXCERPTS["2.NBT.A.1b"] = dict(
    citation=_NBT2_1_BASE["citation"],
    verbatim=_NBT2_1_BASE["verbatim"],
    cc_ref=_NBT2_1_BASE["cc_ref"],
    can_do=[
        "View the multiples 100, 200, …, 900 as one, two, …, nine hundreds (with 0 tens and 0 ones).",
    ],
    misconceptions=_NBT2_1_BASE["misconceptions"],
    progression=_NBT2_1_BASE["progression"],
    representations=_NBT2_1_BASE["representations"],
)

EXCERPTS["2.NBT.A.2"] = dict(
    citation="**Source:** Progressions K–5 NBT, §Grade 2, PDF page 64 (printed page 58).",
    verbatim="""> 2.NBT.2 Count within 1000; skip-count by 5s, 10s, and 100s.
>
> A major task for Grade 2 is learning the counting sequence from 100 to 1,000. As part of learning and using the base-ten structure, students count by ones within various parts of this sequence, especially the more difficult parts that \"cross\" tens or hundreds.
>
> Building on their place value work, students continue to develop proficiency with mental computation. […] They extend this to skip-counting by 5s, 10s, and 100s to emphasize and experience the tens and hundreds within the sequence and to prepare for multiplication. 2.NBT.2
>
> [Sidebar:] Because 2.NBT.2 is designed to prepare students for multiplication, there is no need to start skip-counting at numbers that are not multiples of 5.""",
    cc_ref="1.NBT.1, 1.NBT.2; 3.OA (multiplication).",
    can_do=[
        "Count by ones within 1000, especially across decade and hundred crossings.",
        "Skip-count by 5s, 10s, and 100s starting from multiples of those numbers.",
    ],
    misconceptions=[
        "Not explicitly named, but the \"cross\" points (decades, hundreds) are flagged as the hardest.",
    ],
    progression=[
        "Earlier: K.CC.1 (count to 100, count by tens); 1.NBT.1 (to 120).",
        "Later: 3.OA / multiplication, which 2.NBT.2 is explicitly designed to prepare for.",
    ],
    representations=[
        "Verbal skip-counts (2, 4, 6 not required here; 5, 10, 100).",
        "Number lists structured in columns of 10 to highlight base-ten patterns.",
    ],
)

EXCERPTS["2.NBT.A.3"] = dict(
    citation="**Source:** Progressions K–5 NBT, §Grade 2, PDF page 64 (printed page 58).",
    verbatim="""> 2.NBT.3 Read and write numbers to 1000 using base-ten numerals, number names, and expanded form.
>
> Number words and numbers written in base-ten numerals and as sums of their base-ten units can be connected with representations in drawings and place value cards, and by saying numbers aloud and in terms of their base-ten units, e.g., 456 is \"Four hundred fifty six\" and \"four hundreds five tens six ones.\" 2.NBT.3 Unlayering place value cards reveals the expanded form of the number.""",
    cc_ref="1.NBT.1 (read/write to 120); 4.NBT.2.",
    can_do=[
        "Read and write any number up to 1000 in numerals, in words, and in expanded form (e.g., 456 = 400 + 50 + 6).",
        "Say a number in two ways: \"four hundred fifty-six\" and \"four hundreds, five tens, six ones.\"",
    ],
    misconceptions=[
        "Hundreds-word confusion: students may know 500 as \"the number after 499\" rather than as 5 hundreds.",
    ],
    progression=[
        "Earlier: 1.NBT.1.",
        "Later: 4.NBT.2 (read, write, compare multi-digit whole numbers).",
    ],
    representations=[
        "Layered place value cards (unlayered to reveal expanded form).",
        "Number words alongside numerals.",
    ],
)

EXCERPTS["2.NBT.A.4"] = dict(
    citation="**Source:** Progressions K–5 NBT, §Grade 2, PDF page 64 (printed page 58).",
    verbatim="""> 2.NBT.4 Compare two three-digit numbers based on meanings of the hundreds, tens, and ones digits, using ą, =, and ă symbols to record the results of comparisons.
>
> Comparing magnitudes of two-digit numbers uses the understanding that 1 ten is greater than any amount of ones represented by a one-digit number. Comparing magnitudes of three-digit numbers uses the understanding that 1 hundred (the smallest three-digit number) is greater than any amount of tens and ones represented by a two-digit number. For this reason, three-digit numbers are compared by first inspecting the hundreds place (e.g. 845 ą 799; 849 ă 855). 2.NBT.4 Drawings help support these understandings.""",
    cc_ref="1.NBT.3 (compare two-digit numbers).",
    can_do=[
        "Compare two three-digit numbers by inspecting the hundreds place first, then tens, then ones.",
        "Record the comparison with ą, =, ă.",
    ],
    misconceptions=[
        "Inherits the symbol-direction challenge from 1.NBT.3; alligator/fish metaphor remains discouraged.",
    ],
    progression=[
        "Earlier: 1.NBT.3 (two-digit comparisons), 2.NBT.1 (hundreds).",
        "Later: 4.NBT.2 (compare multi-digit numbers).",
    ],
    representations=[
        "Place-value drawings supporting the hundreds-first inspection.",
    ],
)

EXCERPTS["2.NBT.B.5"] = dict(
    citation="**Source:** Progressions K–5 NBT, §Grade 2, PDF page 65 (printed page 59).",
    verbatim="""> 2.NBT.5 Fluently add and subtract within 100 using strategies based on place value, properties of operations, and/or the relationship between addition and subtraction.
>
> Students fluently add and subtract within 100. 2.NBT.5 They also add and subtract within 1000. 2.NBT.7 They explain why addition and subtraction strategies work, using place value and the properties of operations, and may support their explanations with drawings or objects. 2.NBT.9 Because adding and subtracting within 100 is a special case of adding and subtracting within 1000, methods within 1000 will be discussed before fluency within 100.""",
    cc_ref="1.NBT.4, 1.NBT.6; 2.NBT.7, 2.NBT.9.",
    can_do=[
        "Fluently add and subtract within 100.",
        "Use place-value strategies, properties of operations, or the addition–subtraction relationship.",
    ],
    misconceptions=[
        "The Grade 1 \"in each column, subtract the larger digit from the smaller\" error (e.g., 82 − 45 = 43) is a known hazard if decomposition isn't taught carefully (see 1.NBT.6 discussion).",
    ],
    progression=[
        "Earlier: 1.NBT.4 (add within 100 with strategies); 1.NBT.6 (subtract multiples of 10).",
        "Later: 2.NBT.7 (within 1000), 3.NBT, 4.NBT (standard algorithm).",
    ],
    representations=[
        "Place value drawings; objects bundled in tens.",
        "Written methods with newly composed units recorded on the line.",
    ],
)

EXCERPTS["2.NBT.B.6"] = dict(
    citation="**Source:** Progressions K–5 NBT, §Grade 2, PDF page 64 (printed page 58).",
    verbatim="""> 2.NBT.6 Add up to four two-digit numbers using strategies based on place value and properties of operations.
>
> [Context from p. 58:] Building on their place value work, students continue to develop proficiency with mental computation. They extend this to skip-counting by 5s, 10s, and 100s. […] Comparing magnitudes of two-digit numbers uses the understanding that 1 ten is greater than any amount of ones represented by a one-digit number.
>
> *(2.NBT.6 itself receives only brief treatment in the Progressions narrative; it is grouped with the broader development of Grade 2 base-ten addition/subtraction strategies.)*""",
    cc_ref="1.OA.3 (properties), 1.NBT.4, 2.NBT.5.",
    can_do=[
        "Add up to four two-digit numbers.",
        "Use place-value and properties-of-operations strategies (e.g., look for tens, regroup).",
    ],
    misconceptions=[
        "Not explicitly named for 2.NBT.6 in the Progressions narrative.",
    ],
    progression=[
        "Earlier: 1.OA.2 (add three whole numbers ≤ 20), 1.NBT.4 (add within 100).",
        "Later: 2.NBT.7 (add and subtract within 1000); 3.NBT.2.",
    ],
    representations=[
        "Drawings showing tens and ones being regrouped.",
        "Written methods.",
    ],
)

EXCERPTS["2.NBT.B.7"] = dict(
    citation="**Source:** Progressions K–5 NBT, §Grade 2, PDF page 65 (printed page 59).",
    verbatim="""> 2.NBT.7 Add and subtract within 1000, using concrete models or drawings and strategies based on place value, properties of operations, and/or the relationship between addition and subtraction; relate the strategy to a written method. Understand that in adding or subtracting three-digit numbers, one adds or subtracts hundreds and hundreds, tens and tens, ones and ones; and sometimes it is necessary to compose or decompose tens or hundreds.
>
> [Sidebar on a drawing of 278 + 147:] The student drawing shows the base-ten units of 278 and 147 in three wide columns. The units of 278 are shown above like units of 147. Boundaries around ten tens and ten ones indicate the newly composed hundred and the newly composed ten, which can then be drawn in the next-left columns.
>
> Drawings can support students in understanding and explaining written methods. The drawing in the margin shows addends decomposed into their base-ten units (here, hundreds, tens, and ones). The quick drawings of the units show each hundred as a single unit rather than as ten tens (see illustration on p. 58), generalizing the approach that students used in Grade 1 of showing a ten as a single unit rather than as 10 separate ones. The putting together of like quick drawings illustrates adding like units as specified in 2.NBT.7: add ones to ones, tens to tens, and hundreds to hundreds. The drawing shows newly composed units within drawn boundaries.""",
    cc_ref="1.NBT.4, 1.NBT.6, 2.NBT.5; 3.NBT.2 (within 1000 fluency).",
    can_do=[
        "Add and subtract within 1000 using concrete models, drawings, and place-value strategies.",
        "Compose a ten or a hundred when needed; decompose when needed.",
        "Relate the strategy to a written method.",
    ],
    misconceptions=[
        "Avoid the \"subtract larger digit from smaller in each column\" generalization (highlighted at 1.NBT.6, p. 57): e.g., 82 − 45 = 43.",
    ],
    progression=[
        "Earlier: 2.NBT.5, 1.NBT.4 / 1.NBT.6.",
        "Later: 3.NBT.2 (fluent within 1000), 4.NBT.4 (standard algorithm).",
    ],
    representations=[
        "Quick drawings (each hundred drawn as a single unit, each ten as a single unit).",
        "Written methods with newly composed units recorded on the line.",
        "Left-to-right or right-to-left orderings, both discussed in the Progressions.",
    ],
)

EXCERPTS["2.NBT.B.8"] = dict(
    citation="**Source:** Progressions K–5 NBT, §Grade 2, PDF page 64 (printed page 58).",
    verbatim="""> 2.NBT.8 Mentally add 10 or 100 to a given number 100–900, and mentally subtract 10 or 100 from a given number 100–900.
>
> Building on their place value work, students continue to develop proficiency with mental computation. 2.NBT.8 They extend this to skip-counting by 5s, 10s, and 100s to emphasize and experience the tens and hundreds within the sequence and to prepare for multiplication.""",
    cc_ref="1.NBT.5 (10 more / 10 less).",
    can_do=[
        "Mentally add or subtract 10 from any number 100–900.",
        "Mentally add or subtract 100 from any number 100–900.",
    ],
    misconceptions=[
        "Not explicitly named for 2.NBT.8.",
    ],
    progression=[
        "Earlier: 1.NBT.5 (10 more / 10 less for two-digit numbers).",
        "Later: 3.NBT (rounding, mental computation extensions).",
    ],
    representations=[
        "Place-value cards.",
        "Number lists or charts highlighting tens and hundreds columns.",
    ],
)

EXCERPTS["2.NBT.B.9"] = dict(
    citation="**Source:** Progressions K–5 NBT, §Grade 2, PDF page 65 (printed page 59).",
    verbatim="""> 2.NBT.9 Explain why addition and subtraction strategies work, using place value and the properties of operations. Explanations may be supported by drawings or objects.
>
> They [students] explain why addition and subtraction strategies work, using place value and the properties of operations, and may support their explanations with drawings or objects. 2.NBT.9
>
> [Sidebar — written-method commentary:] Digits representing newly composed units are below the addends, on the line. This placement has several advantages. It is easier to write teen numbers in their usual order (e.g., 1, then 5) rather than \"write 5 and carry 1\" (5, then 1). Each two-digit partial sum (e.g., \"15\") is written with first digit near second, suggesting their origin. Students add pairs of original digits first, then the easy-to-add \"1,\" avoiding the need to hold an altered digit in memory as when the 1 is written above the addends. The original digits are unchanged. The three multi-digit numbers (addends and total) can be seen clearly.""",
    cc_ref="2.NBT.5, 2.NBT.7; 3.NBT.2.",
    can_do=[
        "Explain why an addition or subtraction strategy works, citing place value and properties of operations.",
        "Use a drawing or object to support the explanation.",
    ],
    misconceptions=[
        "Not explicitly named for 2.NBT.9 itself.",
    ],
    progression=[
        "Earlier: 1.NBT.4, 1.NBT.6 (relating strategy to written method, explaining reasoning).",
        "Later: 3.NBT, 4.NBT (continued explanation of standard algorithms).",
    ],
    representations=[
        "Drawings of base-ten units paired with written methods.",
        "Equations and verbal explanations linking the two.",
    ],
)

# ============================================================================
# 3.OA.A.1
# ============================================================================

EXCERPTS["3.OA.A.1"] = dict(
    citation="**Source:** Progressions K–5 OA, §Grade 3, PDF pages 37–41 (printed pages 31–35).",
    verbatim="""> 3.OA.1 Interpret products of whole numbers, e.g., interpret 5 × 7 as the total number of objects in 5 groups of 7 objects each.
>
> Students focus on understanding the meaning and properties of multiplication and division and on finding products and related quotients of single-digit numbers. 3.OA.1–7 These skills and understandings are crucial; students will rely on them for years to come as they learn to multiply and divide with multi-digit whole number and to add, subtract, multiply and divide with fractions and with decimals.
>
> Common multiplication and division situations are shown in Table 3. There are three major types, shown as rows of Table 3. The Grade 3 standards focus on Equal Groups and on Arrays.
>
> In Equal Groups, the roles of the factors differ. One factor is the number of objects in a group (like any quantity in addition and subtraction situations), and the other is a multiplier that indicates the number of groups. So, for example, 4 groups of 3 objects is arranged differently than 3 groups of 4 objects. Thus there are two kinds of division situations depending on which factor is the unknown (the number of objects in each group or the number of groups). In the Array situations, the roles of the factors do not differ. One factor tells the number of rows in the array, and the other factor tells the number of columns in the situation.
>
> [Sidebar:] The top row of Table 3 shows the usual order of writing multiplications of Equal Groups in the United States. The equation 3 × 6 = ? means how many are in 3 groups of 6 things each: three sixes. But in many other countries the equation 3 × 6 = ? means how many are 3 things taken 6 times (6 groups of 3 things each): six threes.""",
    cc_ref="2.OA.3, 2.OA.4 (Level-1 preparation for multiplication); 3.OA.2 (quotients), 3.OA.3 (word problems), 3.OA.5 (properties).",
    can_do=[
        "Interpret a multiplication expression A × B as A groups of B objects each.",
        "Distinguish 4 groups of 3 from 3 groups of 4 in Equal Groups situations (different arrangements, same total).",
    ],
    misconceptions=[
        "Order convention: in the US, 3 × 6 means 3 groups of 6; in many other countries it means 3 things taken 6 times. Some students bring the non-US interpretation from home — the Progressions recommends discussing both and allowing students to use whichever is familiar.",
        "Row-and-column confusion in arrays: \"there are 3 rows but the number of columns (6) tells how many are in each row\" (p. 33).",
    ],
    progression=[
        "Earlier: 2.OA.3 (doubles and even/odd as Level-1 preparation), 2.OA.4 (rectangular arrays ≤ 5×5 with equal-addend equations).",
        "Later: 3.OA.5 (properties of operations for multiplication); 3.OA.7 (fluency by end of Grade 3); 4.OA.1 (multiplicative compare).",
    ],
    representations=[
        "Equal Groups diagrams.",
        "Arrays (rows and columns).",
        "Repeated-addition equations as a bridge (\"3 + 3 + 3 + 3 = 12\" → \"4 × 3 = 12\").",
        "Area models (introduced more formally with 3.MD.5–7).",
    ],
)

# ---------------------------------------------------------------------------

def render(standard_id, e):
    bullets_can_do = "\n".join(f"- {b}" for b in e["can_do"])
    bullets_misc = "\n".join(f"- {b}" for b in e["misconceptions"])
    bullets_prog = "\n".join(f"- {b}" for b in e["progression"])
    bullets_repr = "\n".join(f"- {b}" for b in e["representations"])
    return f"""# Progressions excerpt — {standard_id}

{e['citation']}

## Verbatim excerpt

{e['verbatim']}

## Extraction for drafters

**What the kid should be able to do**

{bullets_can_do}

**Common misconceptions / developmental hurdles named in the Progressions**

{bullets_misc}

**Where this skill sits in the progression**

{bullets_prog}

**Recommended representations / models named in the Progressions**

{bullets_repr}

## Cross-references in the Progressions

{e['cc_ref']}
"""


def main():
    written = []
    missing = []
    for sid, e in EXCERPTS.items():
        folder = os.path.join(ROOT, sid)
        if not os.path.isdir(folder):
            missing.append(sid)
            continue
        target = os.path.join(folder, "progressions-excerpt.md")
        with open(target, "w", encoding="utf-8") as f:
            f.write(render(sid, e))
        written.append(sid)
    print(f"Wrote {len(written)} files.")
    if missing:
        print(f"Missing folders: {missing}")


if __name__ == "__main__":
    main()
