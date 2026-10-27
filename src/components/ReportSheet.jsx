import { useEffect, useMemo, useState } from "react";
import { reportsAPI } from "../services/api";
import "./ReportSheet.css";

const EMPTY_REPORT = {
  attendance: "",
  // Position is never user-entered; it is always computed server-side from
  // the class's current scores and returned on every load.
  position: null,
  teacherName: "",
  teacherComment: "",
  principalComment: "",
  nextTermBegins: "",
  promotedTo: "",
};

function calculateGrade(total) {
  if (total >= 70) {
    return {
      grade: "A",
      remark: "Excellent",
    };
  }

  if (total >= 60) {
    return {
      grade: "B",
      remark: "Very Good",
    };
  }

  if (total >= 50) {
    return {
      grade: "C",
      remark: "Good",
    };
  }

  if (total >= 45) {
    return {
      grade: "D",
      remark: "Average",
    };
  }

  if (total >= 40) {
    return {
      grade: "E",
      remark: "Passed",
    };
  }

  return {
    grade: "F",
    remark: "Failed",
  };
}

function ordinal(number) {
  const value = Number(number);
  if (!value) return "-";
  const remainder100 = value % 100;
  if (remainder100 >= 11 && remainder100 <= 13) return `${value}th`;
  switch (value % 10) {
    case 1:
      return `${value}st`;
    case 2:
      return `${value}nd`;
    case 3:
      return `${value}rd`;
    default:
      return `${value}th`;
  }
}

export default function ReportSheet({
  student,
  courses = [],
  session = "2026/2027",
  term = "First Term",
  editable = false,
}) {
  const [scores, setScores] = useState([]);
  const [report, setReport] = useState(EMPTY_REPORT);
  const [summary, setSummary] = useState({
    subjectsOffered: 0,
    grandTotal: 0,
    maximumTotal: 0,
    percentage: 0,
    classSize: 0,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!student?._id) return;

    loadReport();
  }, [student?._id, session, term]);

  async function loadReport() {
    try {
      setLoading(true);
      setMessage("");

      const response = await reportsAPI.getStudentReport(
        student._id,
        session,
        term
      );

      const data = response.data.data;

      const existingScores = data.scores || [];

      // The subject list always reflects the student's real data: the
      // subjects they are actually enrolled in, plus any subject that
      // already has a saved score (in case it was removed from courses
      // after scoring). No generic/static subject list is ever shown.
      const assignedSubjects = (courses || [])
        .map((c) => (typeof c === "string" ? c : c?.name))
        .filter(Boolean);
      const scoredSubjects = existingScores.map((item) => item.subject);
      const subjectList = Array.from(
        new Set([...assignedSubjects, ...scoredSubjects])
      );

      const mergedScores = subjectList.map((subject) => {
        const existing = existingScores.find(
          (item) => item.subject.toLowerCase() === subject.toLowerCase()
        );

        return (
          existing || {
            subject,
            ca: "",
            exam: "",
            total: "",
            grade: "",
            remark: "",
            position: null,
            totalStudents: 0,
          }
        );
      });

      setScores(mergedScores);

      setReport({
        ...EMPTY_REPORT,
        ...(data.report || {}),
      });

      setSummary(
        data.summary || {
          subjectsOffered: 0,
          grandTotal: 0,
          maximumTotal: 0,
          percentage: 0,
          classSize: 0,
        }
      );
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
          "Unable to load student report."
      );
    } finally {
      setLoading(false);
    }
  }

  function updateScore(index, field, value) {
    if (!editable) return;

    const updated = [...scores];

    let numericValue = value;

    if (field === "ca") {
      numericValue = Math.min(
        Math.max(Number(value || 0), 0),
        30
      );
    }

    if (field === "exam") {
      numericValue = Math.min(
        Math.max(Number(value || 0), 0),
        70
      );
    }

    updated[index] = {
      ...updated[index],
      [field]: value === "" ? "" : numericValue,
    };

    const ca = Number(updated[index].ca || 0);
    const exam = Number(updated[index].exam || 0);

    const hasScore =
      updated[index].ca !== "" ||
      updated[index].exam !== "";

    if (hasScore) {
      const total = ca + exam;
      const result = calculateGrade(total);

      updated[index].total = total;
      updated[index].grade = result.grade;
      updated[index].remark = result.remark;
    } else {
      updated[index].total = "";
      updated[index].grade = "";
      updated[index].remark = "";
    }

    setScores(updated);
    calculateSummary(updated);
  }

  function calculateSummary(data) {
    const scoredSubjects = data.filter(
      (item) =>
        item.ca !== "" ||
        item.exam !== ""
    );

    const grandTotal = scoredSubjects.reduce(
      (sum, item) => sum + Number(item.total || 0),
      0
    );

    const maximumTotal =
      scoredSubjects.length * 100;

    const percentage =
      maximumTotal > 0
        ? Number(
            ((grandTotal / maximumTotal) * 100).toFixed(1)
          )
        : 0;

    setSummary((prev) => ({
      ...prev,
      subjectsOffered: scoredSubjects.length,
      grandTotal,
      maximumTotal,
      percentage,
    }));
  }

  function updateReportField(field, value) {
    if (!editable) return;

    setReport((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function saveReport() {
    if (!editable) return;

    try {
      setSaving(true);
      setMessage("");

      // eslint-disable-next-line no-unused-vars
      const { position, ...editableReportFields } = report;

      await reportsAPI.saveStudentReport(student._id, {
        session,
        term,
        ...editableReportFields,
        scores,
      });

      setMessage("Report sheet saved successfully.");

      await loadReport();
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
          "Unable to save report sheet."
      );
    } finally {
      setSaving(false);
    }
  }

  const studentName = useMemo(() => {
    if (student?.fullName) return student.fullName;
    return [student?.firstName, student?.lastName].filter(Boolean).join(" ");
  }, [student]);

  if (loading) {
    return (
      <div className="report-loading">
        Loading report sheet...
      </div>
    );
  }

  return (
    <div className="report-wrapper">
      {message && (
        <div className="report-message">
          {message}
        </div>
      )}

      {/* HEADER */}

      <div className="report-header">
        <div className="school-logo-box">
          {/* Replace with your actual logo */}
          <img
            src="/logo.png"
            alt="Daaru Tayseer School"
          />
        </div>

        <div className="school-information">
          <div className="arabic-school-name">
            دار تيسير للدراسات العربية والثقافة الإسلامية
          </div>

          <h1>
            ARABIC SCHOOL OF EASY LEARNING AND ISLAMIC CIVILIZATION
          </h1>

          <p>
            Daaru Tayseer School
          </p>

          <small>
            Ibadan, Oyo State, Nigeria
          </small>
        </div>

        <div className="term-badge">
          <strong>{session}</strong>
          <span>{term}</span>
        </div>
      </div>

      <div className="report-title">
        <span>كشف الدرجات</span>
        {" / "}
        {term.toUpperCase()} REPORT SHEET
      </div>

      {/* STUDENT INFORMATION */}

      <div className="student-information-grid">

        <div className="student-info">
          <span>Name</span>
          <strong>{studentName}</strong>
        </div>

        <div className="student-info">
          <span>Session</span>
          <strong>{session}</strong>
        </div>

        <div className="student-info">
          <span>Term</span>
          <strong>{term}</strong>
        </div>

        <div className="student-info">
          <span>Class</span>
          <strong>{student?.grade || "-"}</strong>
        </div>

        <div className="student-info">
          <span>No. in Class</span>
          <strong>
            {summary.classSize || "-"}
          </strong>
        </div>

        <div className="student-info">
          <span>Attendance (Days)</span>

          {editable ? (
            <input
              type="number"
              value={report.attendance}
              onChange={(e) =>
                updateReportField(
                  "attendance",
                  e.target.value
                )
              }
            />
          ) : (
            <strong>
              {report.attendance || "-"}
            </strong>
          )}
        </div>

        <div className="student-info">
          <span>Position</span>

          {/* Always computed from the class's current scores, never manually entered. */}
          <strong>
            {report.position
              ? `${ordinal(report.position)} of ${summary.classSize}`
              : "-"}
          </strong>
        </div>

        <div className="student-info">
          <span>Teacher</span>

          {editable ? (
            <input
              value={report.teacherName}
              onChange={(e) =>
                updateReportField(
                  "teacherName",
                  e.target.value
                )
              }
            />
          ) : (
            <strong>
              {report.teacherName || "-"}
            </strong>
          )}
        </div>
      </div>

      {/* SCORE TABLE */}

      <div className="table-container">
        <table className="report-table">

          <thead>
            <tr>
              <th>#</th>

              <th className="subject-column">
                SUBJECT / المادة
              </th>

              <th>
                Test
                <br />
                <small>/30</small>
              </th>

              <th>
                Exam
                <br />
                <small>/70</small>
              </th>

              <th>
                Total
                <br />
                <small>/100</small>
              </th>

              <th>
                Grade
              </th>

              <th>
                Position
              </th>

              <th>
                Remark
              </th>
            </tr>
          </thead>

          <tbody>
            {scores.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center">
                  No subjects have been assigned to this student yet.
                </td>
              </tr>
            )}

            {scores.map((score, index) => (
              <tr key={score.subject}>

                <td>{index + 1}</td>

                <td className="subject-name">
                  {score.subject}
                </td>

                <td>
                  {editable ? (
                    <input
                      className="score-input"
                      type="number"
                      min="0"
                      max="30"
                      value={score.ca}
                      onChange={(e) =>
                        updateScore(
                          index,
                          "ca",
                          e.target.value
                        )
                      }
                    />
                  ) : (
                    score.ca || ""
                  )}
                </td>

                <td>
                  {editable ? (
                    <input
                      className="score-input"
                      type="number"
                      min="0"
                      max="70"
                      value={score.exam}
                      onChange={(e) =>
                        updateScore(
                          index,
                          "exam",
                          e.target.value
                        )
                      }
                    />
                  ) : (
                    score.exam || ""
                  )}
                </td>

                <td className="total-cell">
                  {score.total || ""}
                </td>

                <td>
                  {score.grade && (
                    <span
                      className={`grade grade-${score.grade}`}
                    >
                      {score.grade}
                    </span>
                  )}
                </td>

                <td>
                  {score.position
                    ? `${ordinal(score.position)} of ${score.totalStudents}`
                    : "-"}
                </td>

                <td>
                  {score.remark && (
                    <span className="remark">
                      {score.remark}
                    </span>
                  )}
                </td>

              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr className="grand-total-row">
              <td colSpan="4">
                GRAND TOTAL
              </td>

              <td colSpan="4">
                {summary.grandTotal} /{" "}
                {summary.maximumTotal}
              </td>
            </tr>

            <tr className="percentage-row">
              <td colSpan="4">
                PERCENTAGE
              </td>

              <td colSpan="4">
                {summary.percentage}%
              </td>
            </tr>
          </tfoot>

        </table>
      </div>

      {/* GRADE SCALE */}

      <div className="grade-scale">
  <strong>GRADE SCALE:</strong>

  <span>70–100 = A - Excellent</span>
  <span>60–69 = B - VeryGood</span>
  <span>50–59 = C - Good</span>
  <span>45–49 = D - Average</span>
  <span>40–44 = E - Passed</span>
  <span>0–39 = F - Failed</span>
</div>
      {/* COMMENTS */}

      <div className="comments-grid">

        <div className="comment-box">

          <h4>
            TEACHER'S COMMENT
          </h4>

          {editable ? (
            <textarea
              value={report.teacherComment}
              onChange={(e) =>
                updateReportField(
                  "teacherComment",
                  e.target.value
                )
              }
              placeholder="Enter teacher's comment..."
            />
          ) : (
            <p>
              {report.teacherComment ||
                "No teacher comment yet."}
            </p>
          )}

          <div className="signature-line">
            Teacher's Sign:
          </div>

        </div>

        <div className="comment-box">

          <h4>
            PRINCIPAL'S COMMENT
          </h4>

          {editable ? (
            <textarea
              value={report.principalComment}
              onChange={(e) =>
                updateReportField(
                  "principalComment",
                  e.target.value
                )
              }
              placeholder="Enter principal's comment..."
            />
          ) : (
            <p>
              {report.principalComment ||
                "No principal comment yet."}
            </p>
          )}

          <div className="signature-line">
            Sign:
          </div>

        </div>

      </div>

      {/* PROMOTION */}

      <div className="promotion-row">

        <div>
          <strong>
            Promoted To:
          </strong>

          {editable ? (
            <input
              value={report.promotedTo}
              onChange={(e) =>
                updateReportField(
                  "promotedTo",
                  e.target.value
                )
              }
            />
          ) : (
            <span>
              {report.promotedTo || "-"}
            </span>
          )}
        </div>

        <div>
          <strong>
            Next Term Begins:
          </strong>

          {editable ? (
            <input
              value={report.nextTermBegins}
              onChange={(e) =>
                updateReportField(
                  "nextTermBegins",
                  e.target.value
                )
              }
            />
          ) : (
            <span>
              {report.nextTermBegins || "-"}
            </span>
          )}
        </div>

      </div>

      {/* ADMIN SAVE */}

      {editable && (
        <div className="report-actions">

          <button
            type="button"
            className="save-report-button"
            onClick={saveReport}
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Save Report Sheet"}
          </button>

        </div>
      )}
    </div>
  );
}