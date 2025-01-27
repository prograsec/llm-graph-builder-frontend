import { Button, Card } from 'react-bootstrap';

const NotLoggedInPage = () => {
  return (
    <div className='min-h-screen bg-slate-50 flex items-center justify-center p-4'>
      <Card className='p-4 shadow text-center rounded-lg max-w-96'>
        <Card.Title className='font-bold'>Not logged in</Card.Title>
        <Card.Body>Your login attempt was unsuccessful. Please verify your credentials and try again.</Card.Body>
        <Card.Footer className='bg-transparent pt-4'>
          <a href='https://cause.systems'>
            <Button className='w-full'>Back to home</Button>
          </a>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default NotLoggedInPage;
