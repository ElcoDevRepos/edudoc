using BreckServiceBase.Utilities.Interfaces;
using Model;
using Service.Base;
using System.Linq;
using System.Data.Entity;
using PdfSharp.Pdf;
using System.IO;
using PdfSharp.Drawing;
using PdfSharp.Drawing.Layout;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace Service.ProviderReferrals
{
    public class ProviderReferralService : CRUDBaseService, IProviderReferralService
    {
        private readonly IPrimaryContext _context;
        public ProviderReferralService(IPrimaryContext context, IEmailHelper emailHelper)
            : base(context, new ValidationService(context, emailHelper))
        {
            _context = context;
        }

        public byte[] GetReferralPdf(int[] referralIds)
        {
            PdfDocument document = new PdfDocument();
            foreach (var referralId in referralIds)
            {
                var referral = _context.SupervisorProviderStudentReferalSignOffs.Include(x => x.SignedOffBy)
                    .Include(x => x.Supervisor).Include(x => x.ServiceCode).FirstOrDefault(x => x.Id == referralId);
                PdfPage page = document.AddPage();
                XGraphics gfx = XGraphics.FromPdfPage(page);
                XTextFormatter tf = new XTextFormatter(gfx);

                XRect rect = new XRect(0, 0, page.Width, page.Height);

                XFont headingFont = new XFont("Helvetica", 14, XFontStyle.Bold);
                XFont textFont = new XFont("Helvetica", 20);
                XBrush brush = XBrushes.Black;

                XStringFormat format = new XStringFormat();
                format.LineAlignment = XLineAlignment.Near;
                format.Alignment = XStringAlignment.Near;

                var student = _context.Students
                    .Include(s => s.School)
                    .Include(s => s.School.SchoolDistrictsSchools)
                    .Where(s => s.Id == referral.StudentId).FirstOrDefault();
                var schoolDistrictId = student.DistrictId ?? student.School.SchoolDistrictsSchools.FirstOrDefault().SchoolDistrictId;
                var school = _context.SchoolDistricts.Where(s =>s.Id == schoolDistrictId).FirstOrDefault();
                var provider = _context.Providers.Where(p => p.Id == referral.Supervisor.Id).FirstOrDefault();
                var providerTitle = _context.ProviderTitles.Where(pt => pt.Id == provider.TitleId).FirstOrDefault();

                tf.DrawString(
                    $"School District: {school?.Name}",
                    headingFont,
                    brush,
                    new XRect(rect.X + 15, rect.Y + 10, rect.Width - 15, 200),
                    format
                );

                tf.DrawString(
                    $"Student Name: {student.FirstName} {student.LastName}",
                    headingFont,
                    brush,
                    new XRect(rect.X + 15, rect.Y + 30, rect.Width - 15, 200),
                    format
                );

                tf.DrawString(
                    $"Student Date of Birth: {student.DateOfBirth.ToShortDateString()}",
                    headingFont,
                    brush,
                    new XRect(rect.X + 15, rect.Y + 50, rect.Width - 15, 200),
                    format
                );

                tf.DrawString(
                    $"Student Grade: {student.Grade}",
                    headingFont,
                    brush,
                    new XRect(rect.X + 15, rect.Y + 70, rect.Width - 15, 200),
                    format
                );

                tf.DrawString(
                    $"Effective Date: {referral.EffectiveDateFrom.GetValueOrDefault().ToShortDateString()}",
                    headingFont,
                    brush,
                    new XRect(rect.X + 15, rect.Y + 90, rect.Width - 15, 200),
                    format
                );

                tf.DrawString(
                    $"Provider Name: {referral.SignedOffBy.FirstName} {referral.SignedOffBy.LastName}",
                    headingFont,
                    brush,
                    new XRect(rect.X + 15, rect.Y + 110, rect.Width - 15, 200),
                    format
                );

                tf.DrawString(
                    $"Provider Title: {provider.ProviderTitle.Name}",
                    headingFont,
                    brush,
                    new XRect(rect.X + 15, rect.Y + 130, rect.Width - 15, 200),
                    format
                );

                tf.DrawString(
                    $"Provider Service Area: {referral.ServiceCode?.Name}",
                    headingFont,
                    brush,
                    new XRect(rect.X + 15, rect.Y + 150, rect.Width - 15, 200),
                    format
                );

                tf.DrawString(
                    $"Provider  NPI: {provider.Npi}",
                    headingFont,
                    brush,
                    new XRect(rect.X + 15, rect.Y + 170, rect.Width - 15, 200),
                    format
                );

                tf.DrawString(
                    referral.SignOffText,
                    textFont,
                    brush,
                    new XRect(rect.X + 15, rect.Y + 210, rect.Width - 15, 200),
                    format
                );

                tf.DrawString(
                    $"Date of E-Signature: {referral.SignOffDate.GetValueOrDefault().ToShortDateString()}",
                    headingFont,
                    brush,
                    new XRect(rect.X + 5, rect.Y + 390, rect.Width - 5, 20),
                    format
                );

                tf.DrawString(
                    $"Signed By: {referral.SignedOffBy.LastName}, {referral.SignedOffBy.FirstName}",
                    headingFont,
                    brush,
                    new XRect(rect.X + 5, rect.Y + 410, rect.Width - 5, 20),
                    format
                );
            }
            using (var stream = new MemoryStream())
            {
                document.Save(stream, true);
                return stream.ToArray();
            }
        }

        public int DeleteReferral(int referralId)
        {
            var referral = _context.SupervisorProviderStudentReferalSignOffs.FirstOrDefault(r => r.Id == referralId);
            if (referral != null)
            {
                _context.SupervisorProviderStudentReferalSignOffs.Remove(referral);
            }
            _context.SaveChanges();
            return referralId;
        }
    }
}
