const ErrorsPostDialog = ({ errors }: { errors: string }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-start gap-2 rounded-lg text-red-800">
        <ul className="list-disc">
          <li className="text-sm">{errors}</li>
        </ul>
      </div>
    </div>
  )
}

export default ErrorsPostDialog
