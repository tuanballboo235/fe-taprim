import { useFetch } from '../../hooks/useFetch';
import { netflixService } from '../../services/api/netflixService';
import Button from '../../components/common/Button';
import '../../styles/Home.css';

function NetflixMail() {
  const { data, isLoading, error, refetch } = useFetch(
    ['tempEmail'],
    () => netflixService.getTempEmail('j8ri6tgfsd@hunght1890.com', 0)
  );

  // Debug: Log data to inspect API response
  console.log('API Response:', { data, isLoading, error });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error?.message || 'An unexpected error occurred'}</div>;

  // Ensure data is an array; handle common API response patterns
  const emails = Array.isArray(data)
    ? data
    : Array.isArray(data?.emails)
    ? data.emails
    : Array.isArray(data?.data)
    ? data.data
    : [];

  return (
    <div className="home-container">
      <h1>Netflix Temporary Emails</h1>
      <Button onClick={refetch}>Refresh Data</Button>
      {emails.length === 0 ? (
        <div>No emails available</div>
      ) : (
        <table className="email-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>From</th>
              <th>To</th>
              <th>Timestamp</th>
              <th>Body</th>
            </tr>
          </thead>
          <tbody>
            {emails.map((email, index) => (
              <tr key={index}>
                <td>{email.subject || 'N/A'}</td>
                <td>{email.from || 'N/A'}</td>
                <td>{email.to || 'N/A'}</td>
                <td>{email.timestamp || 'N/A'}</td>
                <td>
                  {email.body && email.body.trim()
                    ? email.body.substring(0, 100) + '...'
                    : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default NetflixMail;